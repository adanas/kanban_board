<template>
  <div id="app">
    <header>
      <h1>Kanban Board</h1>
      <button class="primary" @click="openNewTaskModal">Add New Task</button>
    </header>
    <KanbanBoard
      :statuses="statuses"
      :tasks="tasks"
      @update:tasks="updateTasks"
      @edit-task="openEditModal"
      @delete-task="deleteTask"
    />
    <NewTaskModal
      v-if="showModal"
      :task-to-edit="taskToEdit"
      @close="closeModal"
      @add-task="addNewTask"
      @edit-task="editTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import KanbanBoard from './components/KanbanBoard.vue';
import NewTaskModal from './components/NewTaskModal.vue';
import type { Task } from './types';
import { useStore } from './store';

// ストアから状態とメソッドを取得します。
const { tasks, statuses, addNewTask, editTask, updateTasks, deleteTask: deleteTaskFromStore } = useStore();

// --- モーダル関連の状態 ---
// 新規/編集タスクモーダルの表示状態を制御します。
const showModal = ref(false);
// 編集中のタスクオブジェクトを保持します。新規作成時は null になります。
const taskToEdit = ref<Task | null>(null);

// --- モーダルを開閉するメソッド ---
// 新規タスク作成モーダルを開きます。
const openNewTaskModal = () => {
  taskToEdit.value = null;
  showModal.value = true;
};

// 既存のタスクを編集するためのモーダルを開きます。
const openEditModal = (task: Task) => {
  taskToEdit.value = task;
  showModal.value = true;
};

// 新規/編集タスクモーダルを閉じます。
const closeModal = () => {
  showModal.value = false;
  taskToEdit.value = null;
};

// 確認ダイアログ付きでタスクを削除します。
const deleteTask = (taskId: number) => {
  if (window.confirm('このタスクを削除してもよろしいですか？')) {
    deleteTaskFromStore(taskId);
  }
};
</script>

<style scoped>
#app {
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
