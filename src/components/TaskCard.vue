<template>
  <div class="task-card">
    <div class="task-card-content">
      <h4>{{ task.name }}</h4>
      <p class="task-description">{{ task.description }}</p>
      <div v-if="task.dueDate" class="due-date">
        <i class="material-icons">schedule</i>
        <span>{{ task.dueDate }}</span>
      </div>
    </div>
    <div class="task-actions">
      <button @click.stop="editTask" class="icon-button">
        <i class="material-icons">edit</i>
      </button>
      <button @click.stop="deleteTask" class="icon-button">
        <i class="material-icons">delete</i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types';

// 親コンポーネントから表示するタスクオブジェクトを受け取ります。
const props = defineProps<{
  task: Task;
}>();

// 親コンポーネントにイベントを通知するための `emit` を定義します。
const emit = defineEmits(['edit-task', 'delete-task']);

/**
 * 編集ボタンがクリックされたときに呼び出されます。
 * 'edit-task' イベントを発生させ、親にタスクオブジェクトを渡します。
 */
const editTask = () => {
  emit('edit-task', props.task);
};

/**
 * 削除ボタンがクリックされたときに呼び出されます。
 * 'delete-task' イベントを発生させ、親にタスクのIDを渡します。
 */
const deleteTask = () => {
  emit('delete-task', props.task.id);
};
</script>

<style scoped>
.task-card {
  background-color: var(--md-surface-color);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.task-card:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.task-card-content h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 500;
}

.task-card-content .task-description {
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}

.due-date {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}

.due-date .material-icons {
  font-size: 1.125rem;
  margin-right: 4px;
}

.task-actions {
  display: flex;
  align-items: center;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  color: rgba(0, 0, 0, 0.54);
}

.icon-button .material-icons {
  font-size: 20px;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
</style>
