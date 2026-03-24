import type { Organization } from '@/types/organization'
import { useState, useMemo } from 'react'
import { useOrganizations } from '@/features/admin/hooks/useOrganizations'
import { useUsers } from '@/features/admin/hooks/useUsers'
import { Button } from '@/shared/ui/button'
import { Building2, Users as UsersIcon, Folder, User, UserPlus, Edit, Trash2, UserMinus, Move, Search } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Checkbox } from '@/shared/ui/checkbox'

// 조직 타입별 아이콘
const orgTypeIcons: Record<string, typeof Building2> = {
  COMPANY: Building2,
  DEPARTMENT: Folder,
  TEAM: UsersIcon,
}

// 재귀적으로 트리 노드 렌더링 (조직 + 사용자)
function OrganizationTreeNode({
  org,
  level = 0,
  selectedOrgId,
  onSelect,
  users,
}: {
  org: Organization
  level?: number
  selectedOrgId: number | null
  onSelect: (org: Organization) => void
  users: Array<{ id: number; username: string; email: string; organizationId: number | null; role: string; isActive: boolean }>
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // 기본적으로 2단계까지 펼침
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set())

  const hasChildren = org.children && org.children.length > 0
  const orgUsers = users.filter(user => user.organizationId === org.id)
  const hasContent = hasChildren || orgUsers.length > 0
  const isSelected = selectedOrgId === org.id
  const Icon = orgTypeIcons[org.orgType] || Building2

  // 조직에 속하지 않은 사용자 필터링
  const availableUsers = useMemo(() => {
    return users.filter(user => user.organizationId === null)
  }, [users])

  // 검색 필터링
  const filteredAvailableUsers = useMemo(() => {
    if (!searchQuery.trim()) return availableUsers
    const query = searchQuery.toLowerCase()
    return availableUsers.filter(
      user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }, [availableUsers, searchQuery])

  const handleToggleUser = (userId: number) => {
    const newSet = new Set(selectedUserIds)
    if (newSet.has(userId)) {
      newSet.delete(userId)
    } else {
      newSet.add(userId)
    }
    setSelectedUserIds(newSet)
  }

  const handleAddMembers = () => {
    // TODO: API 호출하여 실제로 팀원 추가
    console.log('Adding users', Array.from(selectedUserIds), 'to org', org.id)
    setIsAddMemberDialogOpen(false)
    setSelectedUserIds(new Set())
    setSearchQuery('')
  }

  return (
    <div className="ml-4">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
              isSelected
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-accent'
            }`}
            onClick={() => {
              onSelect(org)
              if (hasContent) {
                setIsExpanded(!isExpanded)
              }
            }}
          >
            {hasContent && (
              <span className="text-sm">{isExpanded ? '▼' : '▶'}</span>
            )}
            {!hasContent && <span className="w-3" />}

            <Icon className="w-4 h-4" />

            <div className="flex-1">
              <div className="text-sm">{org.name}</div>
            </div>

            {orgUsers.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {orgUsers.length}명
              </span>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => setIsAddMemberDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>팀원 추가</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => alert('조직 수정 기능 준비 중')}>
            <Edit className="mr-2 h-4 w-4" />
            <span>조직 수정</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => alert('조직 삭제 기능 준비 중')}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>조직 삭제</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* 팀원 추가 다이얼로그 */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>팀원 추가 - {org.name}</DialogTitle>
            <DialogDescription>
              조직에 추가할 사용자를 선택하세요. 현재 조직에 속하지 않은 사용자만 표시됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 검색 입력 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름 또는 이메일로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 사용자 목록 */}
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredAvailableUsers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  {searchQuery
                    ? '검색 결과가 없습니다.'
                    : '추가 가능한 사용자가 없습니다.'}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredAvailableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleToggleUser(user.id)}
                    >
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => handleToggleUser(user.id)}
                      />
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.role === 'ROLE_ADMIN' ? '관리자' : '일반'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 선택된 사용자 수 */}
            {selectedUserIds.size > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedUserIds.size}명 선택됨
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={selectedUserIds.size === 0}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              추가 ({selectedUserIds.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isExpanded && hasContent && (
        <div className="ml-2 border-l border-border">
          {/* 하위 조직 먼저 렌더링 */}
          {org.children?.map((child) => (
            <OrganizationTreeNode
              key={child.id}
              org={child}
              level={level + 1}
              selectedOrgId={selectedOrgId}
              onSelect={onSelect}
              users={users}
            />
          ))}

          {/* 소속 사용자 렌더링 */}
          {orgUsers.map((user) => (
            <ContextMenu key={`user-${user.id}`}>
              <ContextMenuTrigger asChild>
                <div className="ml-4 flex items-center gap-2 py-1.5 px-3 text-sm text-muted-foreground hover:bg-accent rounded cursor-pointer transition-colors">
                  <span className="w-3" />
                  <User className="w-3.5 h-3.5" />
                  <span>{user.username}</span>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={() => alert('사용자 정보 수정 준비 중')}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>정보 수정</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => alert('조직 이동 준비 중')}>
                  <Move className="mr-2 h-4 w-4" />
                  <span>조직 이동</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => alert('팀원 제거 준비 중')}
                  className="text-destructive focus:text-destructive"
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  <span>팀원 제거</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      )}
    </div>
  )
}

export function OrganizationsPage() {
  const { data: organizations = [], isLoading, isError, error, refetch } = useOrganizations()
  const { data: users = [] } = useUsers()
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

  // 선택된 조직의 사용자 필터링
  const orgUsers = selectedOrg
    ? users.filter((user) => user.organizationId === selectedOrg.id)
    : []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">로딩 중...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-destructive">
          {error instanceof Error ? error.message : '조직 목록을 불러오지 못했습니다.'}
        </p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* 왼쪽: 조직 트리 */}
      <div className="w-80 border-r bg-card overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">조직 구조</h2>
          <p className="text-sm text-muted-foreground mt-1">
            조직을 선택하여 상세 정보를 확인하세요
          </p>
        </div>
        <div className="p-2">
          {organizations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              등록된 조직이 없습니다.
            </div>
          ) : (
            <div className="space-y-1">
              {organizations.map((org) => (
                <OrganizationTreeNode
                  key={org.id}
                  org={org}
                  selectedOrgId={selectedOrg?.id || null}
                  onSelect={setSelectedOrg}
                  users={users}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽: 상세 정보 */}
      <div className="flex-1 overflow-y-auto">
        {selectedOrg ? (
          <div className="p-6">
            {/* 조직 정보 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const Icon = orgTypeIcons[selectedOrg.orgType] || Building2
                  return <Icon className="w-8 h-8 text-primary" />
                })()}
                <div>
                  <h1 className="text-2xl font-bold">{selectedOrg.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrg.code} • {selectedOrg.orgType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-muted-foreground">조직 코드</p>
                  <p className="font-medium">{selectedOrg.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">조직 유형</p>
                  <p className="font-medium">
                    {selectedOrg.orgType === 'COMPANY'
                      ? '회사'
                      : selectedOrg.orgType === 'DEPARTMENT'
                      ? '부서'
                      : '팀'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">레벨</p>
                  <p className="font-medium">{selectedOrg.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">소속 인원</p>
                  <p className="font-medium">{orgUsers.length}명</p>
                </div>
              </div>
            </div>

            {/* 소속 사용자 목록 */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                소속 사용자 ({orgUsers.length})
              </h2>

              {orgUsers.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    이 조직에 소속된 사용자가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orgUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {user.role === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.isActive ? '활성' : '비활성'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                왼쪽에서 조직을 선택하세요
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                조직의 상세 정보와 소속 사용자를 확인할 수 있습니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
