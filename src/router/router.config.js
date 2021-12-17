/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  // 创作中心
  {
    path: '/',
    component: () => import('@/views/createCenter/VideoEditing'),
    meta: {
      title: '视频编辑',
      keepAlive: false
    }
  }
]
