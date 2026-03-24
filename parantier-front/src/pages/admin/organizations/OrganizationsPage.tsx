import { useQuery } from '@tanstack/react-query'
import { organizationApi } from '@/entities/organization/api/organizationApi'
import type { Organization } from '@/types/organization'
import { useState } from 'react'

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
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations', 'tree'],
    queryFn: () => organizationApi.getTree(),
  })

  if (isLoading) {
    return <div className="p-6">로딩 중...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">조직 관리</h1>
        <p className="text-muted-foreground mt-1">
          회사의 조직 구조를 관리합니다
        </p>
      </div>

      <div className="bg-card rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-4">조직 구조</h2>

        {organizations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            조직이 없습니다
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
