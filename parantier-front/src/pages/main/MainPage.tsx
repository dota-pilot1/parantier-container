import { useStore } from '@tanstack/react-store'
import { authStore } from '@/entities/user/model/authStore'

export function MainPage() {
  const auth = useStore(authStore, (state) => state)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Palantier</h1>
        <p className="text-lg text-muted-foreground mb-8">
          채용 및 업무 관리, 지식 공유 플랫폼
        </p>

        {auth.isAuthenticated ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">프로젝트 관리</h3>
                <p className="text-sm text-muted-foreground">
                  프로젝트와 업무를 관리하고 진행 상황을 추적하세요.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">지식 공유</h3>
                <p className="text-sm text-muted-foreground">
                  팀 지식을 문서화하고 공유하세요.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">사내 쇼핑몰</h3>
                <p className="text-sm text-muted-foreground">
                  사내 상품을 주문하고 관리하세요.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">로그인이 필요합니다</h2>
            <p className="text-muted-foreground">
              상단 헤더에서 로그인하여 서비스를 이용하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
