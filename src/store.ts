import { ref, watch } from 'vue';
import type { Task, Status } from './types';

// localStorageから状態を読み込むキー
const TASKS_STORAGE_KEY = 'kanban-tasks';

// 初期状態のステータス
const initialStatuses: Status[] = [
  { id: 1, name: '新規' },
  { id: 2, name: '作業中' },
  { id: 3, name: '完了' },
  { id: 4, name: '中止' },
];

// 初期状態のタスク（localStorageに何もない場合のサンプル）
const initialTasks: Task[] = [
  { id: 1, name: 'Task 1', description: 'This is task 1', statusId: 1, dueDate: '2024-01-01' },
  { id: 2, name: 'Task 2', description: 'This is task 2', statusId: 1 },
  { id: 3, name: 'Task 3', description: 'This is task 3', statusId: 2, dueDate: '2024-02-01' },
];

// localStorageからタスクを読み込む
const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
const tasks = ref<Task[]>(storedTasks ? JSON.parse(storedTasks) : initialTasks);

// ステータスは固定
const statuses = ref<Status[]>(initialStatuses);

/**
 * 新しいタスクを追加します。
 * @param taskData - 新しいタスクのデータ。
 */
const addNewTask = (taskData: Omit<Task, 'id' | 'statusId'>) => {
  const newTask: Task = {
    id: Date.now(),
    ...taskData,
    statusId: 1, // デフォルトで「新規」ステータス
  };
  tasks.value.push(newTask);
};

/**
 * 既存のタスクを更新します。
 * @param updatedTask - 更新されたタスクオブジェクト。
 */
const editTask = (updatedTask: Task) => {
  const index = tasks.value.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  }
};

/**
 * タスクを削除します。
 * @param taskId - 削除するタスクのID。
 */
const deleteTask = (taskId: number) => {
  tasks.value = tasks.value.filter(t => t.id !== taskId);
};

/**
 * タスクリスト全体を更新します (ドラッグアンドドロップ用)。
 * @param newTasks - 新しいタスクの配列。
 */
const updateTasks = (newTasks: Task[]) => {
  tasks.value = newTasks;
};

// `tasks` ref の変更を監視し、変更があった場合に localStorage に保存します。
watch(
  tasks,
  (newTasks) => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
  },
  { deep: true } // ネストされたオブジェクトの変更も検知します。
);

// ストアとして提供する関数とリアクティブな状態
export function useStore() {
  return {
    tasks,
    statuses,
    addNewTask,
    editTask,
    deleteTask,
    updateTasks,
  };
}
