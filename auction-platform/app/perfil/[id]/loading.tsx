export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          {/* Profile Header Skeleton */}
          <div className="bg-white rounded-lg border p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-32 h-32 bg-muted rounded-full" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded w-64" />
                  <div className="h-4 bg-muted rounded w-48" />
                  <div className="h-4 bg-muted rounded w-32" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-20" />
                  <div className="h-6 bg-muted rounded w-24" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-16" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-20" />
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-4 bg-muted rounded w-28" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20" />
                    <div className="h-8 bg-muted rounded w-16" />
                  </div>
                  <div className="w-8 h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-muted rounded w-24" />
              ))}
            </div>
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-muted rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-48" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="h-6 bg-muted rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
