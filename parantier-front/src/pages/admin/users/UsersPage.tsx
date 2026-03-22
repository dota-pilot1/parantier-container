import { useMemo } from 'react'
import { type UserResponse } from '@/entities/user/api/adminApi'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useUsers } from '@/features/admin/hooks/useUsers'
import { useUpdateUserRole } from '@/features/admin/hooks/useUpdateUserRole'

// AG-Grid 모듈 등록
ModuleRegistry.registerModules([AllCommunityModule])

// 권한 셀 렌더러
function RoleCellRenderer(props: ICellRendererParams<UserResponse>) {
  const { mutate: updateRole, isPending } = useUpdateUserRole()

  const handleRoleChange = (newRole: string) => {
    if (!props.data) return

    const previousRole = props.value

    // 낙관적 업데이트 (즉시 UI 반영)
    props.node.setDataValue('role', newRole)

    updateRole(
      {
        userId: props.data.id,
        newRole,
        userName: props.data.username,
      },
      {
        onError: () => {
          // 에러 발생 시 롤백
          props.node.setDataValue('role', previousRole)
        },
      }
    )
  }

  return (
    <div className="flex items-center h-full py-2 px-1">
      <Select
        value={props.value}
        onValueChange={handleRoleChange}
        disabled={isPending}
      >
        <SelectTrigger className="h-10 text-sm border-gray-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ROLE_USER">일반 사용자</SelectItem>
          <SelectItem value="ROLE_ADMIN">관리자</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// 상태 셀 렌더러
function StatusCellRenderer(props: ICellRendererParams<UserResponse>) {
  const isActive = props.value

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {isActive ? '활성' : '비활성'}
    </span>
  )
}

export function UsersPage() {
  const { data: users = [], isLoading, isError, error, refetch } = useUsers()

  // AG-Grid 컬럼 정의
  const columnDefs = useMemo<ColDef<UserResponse>[]>(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        width: 90,
        filter: 'agNumberColumnFilter',
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' } as any,
      },
      {
        headerName: '이메일',
        field: 'email',
        flex: 2,
        minWidth: 250,
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' } as any,
      },
      {
        headerName: '이름',
        field: 'username',
        width: 180,
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' } as any,
      },
      {
        headerName: '권한',
        field: 'role',
        width: 240,
        cellRenderer: RoleCellRenderer,
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center', padding: '8px 12px' } as any,
      },
      {
        headerName: '상태',
        field: 'isActive',
        width: 120,
        cellRenderer: StatusCellRenderer,
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' } as any,
      },
      {
        headerName: '가입일',
        field: 'createdAt',
        width: 180,
        valueFormatter: (params) => {
          return new Date(params.value).toLocaleDateString('ko-KR')
        },
        filter: 'agDateColumnFilter',
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' } as any,
      },
    ],
    []
  )

  // AG-Grid 기본 컬럼 설정
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }),
    []
  )

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
          {error instanceof Error ? error.message : '유저 목록을 불러오지 못했습니다.'}
        </p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">유저 관리</h1>
        <p className="text-muted-foreground mt-2">
          전체 사용자 목록을 확인하고 권한을 관리할 수 있습니다.
        </p>
      </div>

      <div style={{ height: '650px', width: '100%' }}>
        <AgGridReact<UserResponse>
          rowData={users}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          rowSelection={{ mode: 'singleRow' }}
          suppressCellFocus={true}
          theme={themeQuartz.withParams({
            headerHeight: 52,
            rowHeight: 60,
            fontSize: 14,
            headerFontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
          })}
        />
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">등록된 사용자가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
