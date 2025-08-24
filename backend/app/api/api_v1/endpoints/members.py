"""
IROAS BOSS System - Members API
会員管理APIエンドポイント (P-002対応)
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime

from app.core.database import get_db
from app.models.member import Member as MemberModel, MemberStatus
from app.schemas.member import (
    Member, MemberCreate, MemberUpdate, MemberList, MemberStats
)

router = APIRouter()


@router.get("/", response_model=MemberList)
async def get_members(
    skip: int = Query(0, ge=0, description="スキップする件数"),
    limit: int = Query(100, ge=1, le=1000, description="取得する件数"),
    status: Optional[str] = Query(None, description="ステータスフィルタ"),
    search: Optional[str] = Query(None, description="検索キーワード"),
    db: AsyncSession = Depends(get_db)
):
    """
    会員一覧取得
    P-002 会員管理ページで使用
    """
    # Base query
    query = select(MemberModel)
    count_query = select(func.count(MemberModel.id))
    
    # Status filter
    if status:
        query = query.where(MemberModel.status == status)
        count_query = count_query.where(MemberModel.status == status)
    
    # Search filter
    if search:
        search_filter = (
            MemberModel.family_name.contains(search) |
            MemberModel.given_name.contains(search) |
            MemberModel.member_code.contains(search) |
            MemberModel.email.contains(search)
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)
    
    # Add pagination and ordering
    query = query.offset(skip).limit(limit).order_by(MemberModel.registration_date.desc())
    
    # Execute queries
    result = await db.execute(query)
    count_result = await db.execute(count_query)
    
    members = result.scalars().all()
    total = count_result.scalar()
    
    return MemberList(
        members=[Member.from_orm(member) for member in members],
        total=total,
        page=(skip // limit) + 1,
        size=limit
    )


@router.get("/stats", response_model=MemberStats)
async def get_member_stats(
    db: AsyncSession = Depends(get_db)
):
    """
    会員統計データ取得
    ダッシュボード用
    """
    # Total members by status
    stats_query = select(
        MemberModel.status,
        func.count(MemberModel.id).label('count')
    ).group_by(MemberModel.status)
    
    result = await db.execute(stats_query)
    status_counts = {row.status: row.count for row in result}
    
    # New registrations this month
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    new_members_query = select(func.count(MemberModel.id)).where(
        MemberModel.registration_date >= current_month_start
    )
    new_members_result = await db.execute(new_members_query)
    new_registrations = new_members_result.scalar()
    
    return MemberStats(
        total_members=sum(status_counts.values()),
        active_members=status_counts.get(MemberStatus.ACTIVE.value, 0),
        suspended_members=status_counts.get(MemberStatus.SUSPENDED.value, 0),
        withdrawn_members=status_counts.get(MemberStatus.WITHDRAWN.value, 0),
        pending_members=status_counts.get(MemberStatus.PENDING.value, 0),
        new_registrations_this_month=new_registrations
    )


@router.get("/{member_id}", response_model=Member)
async def get_member(
    member_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    会員詳細取得
    """
    query = select(MemberModel).where(MemberModel.id == member_id)
    result = await db.execute(query)
    member = result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    return Member.from_orm(member)


@router.post("/", response_model=Member)
async def create_member(
    member_data: MemberCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    会員新規作成
    """
    # Check if member code already exists
    existing_query = select(MemberModel).where(MemberModel.member_code == member_data.member_code)
    existing_result = await db.execute(existing_query)
    if existing_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Member code already exists")
    
    # Check if email already exists
    email_query = select(MemberModel).where(MemberModel.email == member_data.email)
    email_result = await db.execute(email_query)
    if email_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create new member
    member = MemberModel(
        **member_data.dict(),
        registration_date=datetime.utcnow(),
        status=MemberStatus.PENDING.value,
        is_active=True,
        organization_level=1,
        total_sales=0,
        total_rewards=0
    )
    
    db.add(member)
    await db.commit()
    await db.refresh(member)
    
    return Member.from_orm(member)


@router.put("/{member_id}", response_model=Member)
async def update_member(
    member_id: int,
    member_data: MemberUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    会員情報更新
    """
    query = select(MemberModel).where(MemberModel.id == member_id)
    result = await db.execute(query)
    member = result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Update fields
    update_data = member_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)
    
    # Handle status change dates
    if 'status' in update_data:
        now = datetime.utcnow()
        if update_data['status'] == MemberStatus.ACTIVE.value:
            member.activation_date = now
        elif update_data['status'] == MemberStatus.SUSPENDED.value:
            member.suspension_date = now
        elif update_data['status'] == MemberStatus.WITHDRAWN.value:
            member.withdrawal_date = now
            member.is_active = False
    
    await db.commit()
    await db.refresh(member)
    
    return Member.from_orm(member)


@router.delete("/{member_id}")
async def delete_member(
    member_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    会員削除（論理削除）
    """
    query = select(MemberModel).where(MemberModel.id == member_id)
    result = await db.execute(query)
    member = result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Soft delete by setting status to withdrawn
    member.status = MemberStatus.WITHDRAWN.value
    member.withdrawal_date = datetime.utcnow()
    member.is_active = False
    
    await db.commit()
    
    return {"message": "Member deleted successfully"}