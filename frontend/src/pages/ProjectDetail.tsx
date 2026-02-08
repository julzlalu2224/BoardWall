import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { FolderKanban, Users, CheckSquare } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getOne(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const todoTasks = project.tasks?.filter((t: any) => t.status === 'TODO') || [];
  const inProgressTasks = project.tasks?.filter((t: any) => t.status === 'IN_PROGRESS') || [];
  const doneTasks = project.tasks?.filter((t: any) => t.status === 'DONE') || [];

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FolderKanban className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-2">{project.description || 'No description'}</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckSquare className="w-4 h-4 mr-1" />
                  {project.tasks?.length || 0} tasks
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {project.members?.length || 0} members
                </div>
              </div>
            </div>
          </div>
          <span
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              project.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : project.status === 'COMPLETED'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO Column */}
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>To Do</span>
            <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
              {todoTasks.length}
            </span>
          </h3>
          <div className="space-y-3">
            {todoTasks.map((task: any) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${
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
                  {task.assignee && (
                    <span className="text-gray-600">
                      {task.assignee.firstName} {task.assignee.lastName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="card bg-blue-50">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>In Progress</span>
            <span className="text-sm bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
              {inProgressTasks.length}
            </span>
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map((task: any) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${
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
                  {task.assignee && (
                    <span className="text-gray-600">
                      {task.assignee.firstName} {task.assignee.lastName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DONE Column */}
        <div className="card bg-green-50">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>Done</span>
            <span className="text-sm bg-green-200 text-green-700 px-2 py-1 rounded-full">
              {doneTasks.length}
            </span>
          </h3>
          <div className="space-y-3">
            {doneTasks.map((task: any) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${
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
                  {task.assignee && (
                    <span className="text-gray-600">
                      {task.assignee.firstName} {task.assignee.lastName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.members?.map((member: any) => (
            <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-700">
                  {member.user.firstName?.charAt(0)}{member.user.lastName?.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {member.user.firstName} {member.user.lastName}
                </p>
                <p className="text-sm text-gray-600 truncate">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}