import { useQuery } from '@tanstack/react-query'
import { authorityApi } from '@/entities/authority/api/authorityApi'

export function AuthoritiesPage() {
  const { data: authorities = [], isLoading } = useQuery({
    queryKey: ['authorities'],
    queryFn: () => authorityApi.getAll(),
  })

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex h-[500px] items-center justify-center">
          <div className="text-muted-foreground">권한 목록을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  // 카테고리별로 그룹화
  const groupedByCategory = authorities.reduce((acc, auth) => {
    const category = auth.category || '기타'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(auth)
    return acc
  }, {} as Record<string, typeof authorities>)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">권한 관리</h1>
        <p className="text-muted-foreground mt-2">
          시스템 권한을 조회하고 관리합니다.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByCategory).map(([category, auths]) => (
          <div key={category} className="rounded-lg border bg-card">
            <div className="border-b p-4 bg-muted/50">
              <h2 className="font-semibold text-lg">{category}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {auths.length}개의 권한
              </p>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm">
                    <th className="pb-2 font-medium">권한 이름</th>
                    <th className="pb-2 font-medium">설명</th>
                    <th className="pb-2 font-medium text-right">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {auths.map((auth) => (
                    <tr
                      key={auth.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {auth.name}
                        </code>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {auth.description}
                      </td>
                      <td className="py-3 text-sm text-right text-muted-foreground">
                        #{auth.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {authorities.length === 0 && (
        <div className="flex h-[400px] items-center justify-center rounded-lg border bg-card">
          <div className="text-center text-muted-foreground">
            등록된 권한이 없습니다.
          </div>
        </div>
      )}
    </div>
  )
}
