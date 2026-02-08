<script setup lang="ts">
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import type { Status, Task } from '../types';

// 親コンポーネントから受け取るプロパティを定義します。
const props = defineProps<{
  statuses: Status[]; // タスクのステータスのリスト
  tasks: Task[];     // すべてのタスクのリスト
}>();

// 親コンポーネントにイベントを通知するための `emit` を定義します。
const emit = defineEmits(['update:tasks', 'edit-task', 'delete-task']);

/**
 * 指定されたステータスIDに一致するタスクのリストを返します。
 * @param {number} statusId - フィルタリングするステータスのID。
 * @returns {Task[]} - 指定されたステータスに一致するタスクの配列。
 */
const getTasksByStatus = (statusId: number) => {
  return props.tasks.filter(task => task.statusId === statusId);
};

/**
 * タスクが別の列にドラッグ＆ドロップされたときに呼び出されます。
 * タスクのステータスを更新し、親コンポーネントに変更を通知します。
 * @param {any} event - vuedraggableからのイベントオブジェクト。
 * @param {number} statusId - タスクがドロップされた新しいステータスのID。
 */
const handleTaskDrop = (event: any, statusId: number) => {
  // `added` イベントは、タスクが新しいリスト（列）に追加されたときに発生します
  if (event.added) {
    const task = event.added.element as Task;
    const taskIndex = props.tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      const updatedTasks = [...props.tasks];
      updatedTasks[taskIndex] = { ...task, statusId: statusId };
      emit('update:tasks', updatedTasks);
    }
  }
};
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 16px;
}

.column {
  flex: 1;
  background-color: #eceff1;
  border-radius: 8px;
  padding: 16px;
}

.column h2 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.12);
}

.list-group {
  min-height: 200px;
}

.list-group-item {
  margin-bottom: 16px;
  cursor: grab;
  /* Remove default item styling, TaskCard will handle it */
  background: transparent;
  padding: 0;
  border: none;
  border-radius: 0;
}
</style>

<template>
  <div class="kanban-board">
    <div v-for="status in statuses" :key="status.id" class="column">
      <h2>{{ status.name }}</h2>
      <draggable
        class="list-group"
        :list="getTasksByStatus(status.id)"
        group="tasks"
        @change="handleTaskDrop($event, status.id)"
        itemKey="id"
      >
        <template #item="{ element }">
          <div class="list-group-item">
            <task-card
              :task="element"
              @edit-task="emit('edit-task', element)"
              @delete-task="emit('delete-task', element.id)"
            />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
