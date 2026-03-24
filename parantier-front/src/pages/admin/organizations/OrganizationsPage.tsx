import type { Organization } from '@/types/organization'
import { useState } from 'react'
import { useOrganizations } from '@/features/admin/hooks/useOrganizations'
import { useUsers } from '@/features/admin/hooks/useUsers'
import { Button } from '@/shared/ui/button'
import { Building2, Users as UsersIcon, Folder, User } from 'lucide-react'

// 조직 타입별 아이콘
const orgTypeIcons: Record<string, typeof Building2> = {
  COMPANY: Building2,
  DEPARTMENT: Folder,
  TEAM: UsersIcon,
}

// 재귀적으로 트리 노드 렌더링 (선택 가능)
function OrganizationTreeNode({
  org,
  level = 0,
  selectedOrgId,
  onSelect,
}: {
  org: Organization
  level?: number
  selectedOrgId: number | null
  onSelect: (org: Organization) => void
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // 기본적으로 2단계까지 펼침
  const hasChildren = org.children && org.children.length > 0
  const isSelected = selectedOrgId === org.id
  const Icon = orgTypeIcons[org.orgType] || Building2

  return (
    <div className="ml-4">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
          isSelected
            ? 'bg-primary text-primary-foreground font-medium'
            : 'hover:bg-accent'
        }`}
        onClick={() => {
          onSelect(org)
          if (hasChildren) {
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {hasChildren && (
          <span className="text-sm">{isExpanded ? '▼' : '▶'}</span>
        )}
        {!hasChildren && <span className="w-3" />}

        <Icon className="w-4 h-4" />

        <div className="flex-1">
          <div className="text-sm">{org.name}</div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-2 border-l border-border">
          {org.children?.map((child) => (
            <OrganizationTreeNode
              key={child.id}
              org={child}
              level={level + 1}
              selectedOrgId={selectedOrgId}
              onSelect={onSelect}
            />
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
