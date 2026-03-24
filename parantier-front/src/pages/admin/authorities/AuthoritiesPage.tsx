import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authorityApi } from '@/entities/authority/api/authorityApi'
import type { Authority, CreateAuthorityRequest } from '@/types/authority'
import { Button } from '@/shared/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'

export function AuthoritiesPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAuthority, setEditingAuthority] = useState<Authority | null>(null)
  const [formData, setFormData] = useState<CreateAuthorityRequest>({
    name: '',
    description: '',
    category: '',
  })

  const { data: authorities = [], isLoading } = useQuery({
    queryKey: ['authorities'],
    queryFn: () => authorityApi.getAll(),
  })

  // 생성 mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAuthorityRequest) => authorityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorities'] })
      toast.success('권한이 생성되었습니다')
      handleCloseDialog()
    },
    onError: () => {
      toast.error('권한 생성에 실패했습니다')
    },
  })

  // 수정 mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CreateAuthorityRequest
    }) => authorityApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorities'] })
      toast.success('권한이 수정되었습니다')
      handleCloseDialog()
    },
    onError: () => {
      toast.error('권한 수정에 실패했습니다')
    },
  })

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => authorityApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorities'] })
      toast.success('권한이 삭제되었습니다')
    },
    onError: () => {
      toast.error('권한 삭제에 실패했습니다')
    },
  })

  const handleOpenDialog = (authority?: Authority) => {
    if (authority) {
      setEditingAuthority(authority)
      setFormData({
        name: authority.name,
        description: authority.description,
        category: authority.category,
      })
    } else {
      setEditingAuthority(null)
      setFormData({
        name: '',
        description: '',
        category: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingAuthority(null)
    setFormData({
      name: '',
      description: '',
      category: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAuthority) {
      updateMutation.mutate({ id: editingAuthority.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (authority: Authority) => {
    if (confirm(`${authority.name} 권한을 삭제하시겠습니까?`)) {
      deleteMutation.mutate(authority.id)
    }
  }

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
    <>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">권한 관리</h1>
            <p className="text-muted-foreground mt-2">
              시스템 권한을 조회하고 관리합니다.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            카테고리 추가
          </Button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedByCategory).map(([category, auths]) => (
            <div key={category} className="rounded-lg border bg-card">
              <div className="border-b p-4 bg-muted/50 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{category}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {auths.length}개의 권한
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFormData({ name: '', description: '', category })
                    setEditingAuthority(null)
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  권한 추가
                </Button>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm">
                      <th className="pb-2 font-medium">권한 이름</th>
                      <th className="pb-2 font-medium">설명</th>
                      <th className="pb-2 font-medium text-right">ID</th>
                      <th className="pb-2 font-medium text-right">작업</th>
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
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(auth)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(auth)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
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

      {/* 카테고리/권한 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAuthority
                ? '권한 수정'
                : formData.category
                ? `${formData.category} 카테고리에 권한 추가`
                : '새 카테고리 추가'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Input
                  id="category"
                  placeholder="예: PROJECT"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  disabled={!!formData.category && !editingAuthority}
                  required
                />
                {formData.category && !editingAuthority && (
                  <p className="text-xs text-muted-foreground">
                    카테고리가 자동으로 설정되었습니다
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">권한 이름</Label>
                <Input
                  id="name"
                  placeholder="예: PROJECT:CREATE"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required={!!formData.category}
                />
                {!formData.name && formData.category && (
                  <p className="text-xs text-muted-foreground">
                    카테고리만 추가하려면 비워두세요
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  placeholder="권한에 대한 설명을 입력하세요"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required={!!formData.name}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingAuthority ? '수정' : '추가'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
