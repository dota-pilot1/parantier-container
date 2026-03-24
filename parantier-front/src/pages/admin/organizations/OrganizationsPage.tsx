import type { Organization } from '@/types/organization'
import { useState } from 'react'
import { useOrganizations } from '@/features/admin/hooks/useOrganizations'
import { Button } from '@/shared/ui/button'

// 조직 타입별 아이콘
const orgTypeIcons: Record<string, string> = {
  COMPANY: '🏢',
  DEPARTMENT: '📁',
  TEAM: '👥',
}

// 재귀적으로 트리 노드 렌더링
function OrganizationTreeNode({ org, level = 0 }: { org: Organization; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // 기본적으로 2단계까지 펼침

  const hasChildren = org.children && org.children.length > 0

  return (
    <div className="ml-4">
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-accent rounded cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="text-sm">{isExpanded ? '▼' : '▶'}</span>
        )}
        {!hasChildren && <span className="w-3" />}

        <span className="text-lg">{orgTypeIcons[org.orgType] || '📋'}</span>

        <div className="flex-1">
          <div className="font-medium">{org.name}</div>
          <div className="text-xs text-muted-foreground">
            {org.code} • {org.orgType}
            {org.description && ` • ${org.description}`}
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-border">
          {org.children?.map((child) => (
            <OrganizationTreeNode key={child.id} org={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function OrganizationsPage() {
  const { data: organizations = [], isLoading, isError, error, refetch } = useOrganizations()

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
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">조직 관리</h1>
        <p className="text-muted-foreground mt-2">
          회사의 조직 구조를 확인하고 관리할 수 있습니다.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">조직 구조</h2>

        {organizations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            등록된 조직이 없습니다.
          </div>
        ) : (
          <div className="space-y-1">
            {organizations.map((org) => (
              <OrganizationTreeNode key={org.id} org={org} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
