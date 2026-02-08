import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
import { timeApi } from '../api/time';
import { CheckSquare, Clock, FolderKanban, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.getAll(),
  });

  const { data: activeTimer } = useQuery({
    queryKey: ['activeTimer'],
    queryFn: () => timeApi.getActiveTimer(),
    refetchInterval: 5000,
  });

  const inProgressTasks = tasks?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0;
  const doneTasks = tasks?.filter((t: any) => t.status === 'DONE').length || 0;

  const stats = [
    {
      label: 'Active Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Tasks',
      value: tasks?.length || 0,
      icon: CheckSquare,
      color: 'bg-green-500',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
    {
      label: 'Completed',
      value: doneTasks,
      icon: CheckSquare,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Active Timer Alert */}
      {activeTimer && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-600 animate-pulse" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Timer Running</h3>
                <p className="text-sm text-gray-600">{activeTimer.task?.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Projects</h2>
        {projects && projects.length > 0 ? (
          <div className="space-y-3">
            {projects.slice(0, 5).map((project: any) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.tasks?.length || 0} tasks</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No projects yet. Create your first project!</p>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tasks</h2>
        {tasks && tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task: any) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.project?.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      task.priority === 'URGENT'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'HIGH'
                        ? 'bg-orange-100 text-orange-800'
                        : task.priority === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      task.status === 'DONE'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tasks yet. Create your first task!</p>
        )}
      </div>
    </div>
  );
}