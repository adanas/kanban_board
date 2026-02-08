<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>{{ isEditMode ? 'Edit Task' : 'New Task' }}</h3>
      <form @submit.prevent="submitTask">
        <div class="form-field">
          <input type="text" id="taskName" v-model="taskData.name" required placeholder=" " />
          <label for="taskName">Task Name</label>
        </div>
        <div class="form-field">
          <textarea id="taskDescription" v-model="taskData.description" placeholder=" "></textarea>
          <label for="taskDescription">Description</label>
        </div>
        <div class="form-field">
          <input type="date" id="taskDueDate" v-model="taskData.dueDate" placeholder=" " />
          <label for="taskDueDate">Due Date</label>
        </div>
        <div class="form-actions">
          <button type="button" class="text" @click="close">Cancel</button>
          <button type="submit" class="primary">{{ isEditMode ? 'Save Changes' : 'Add Task' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Task } from '../types';

// 親コンポーネントから受け取るプロパティを定義します。
const props = defineProps<{
  taskToEdit?: Task | null; // 編集対象のタスク。新規作成の場合は null。
}>();

// 親コンポーネントにイベントを通知するための `emit` を定義します。
const emit = defineEmits(['close', 'add-task', 'edit-task']);

// フォームの入力データを保持するリアクティブなオブジェクトです。
const taskData = ref({
  name: '',
  description: '',
  dueDate: '',
});

// モーダルが編集モードであるかどうかを示します。
const isEditMode = ref(false);

// `taskToEdit` プロパティの変更を監視します。
// 編集するタスクが渡された場合、フォームデータをそのタスクの内容で更新します。
watch(
  () => props.taskToEdit,
  (newTask) => {
    if (newTask) {
      isEditMode.value = true;
      taskData.value = {
        name: newTask.name,
        description: newTask.description,
        dueDate: newTask.dueDate || '',
      };
    } else {
      isEditMode.value = false;
      taskData.value = {
        name: '',
        description: '',
        dueDate: '',
      };
    }
  },
  { immediate: true } // コンポーネントの初期化時にもウォッチャーを即時実行します。
);

/**
 * フォームが送信されたときに呼び出されます。
 * 編集モードかどうかに応じて、'edit-task' または 'add-task' イベントを発生させます。
 */
const submitTask = () => {
  if (taskData.value.name.trim()) {
    if (isEditMode.value) {
      emit('edit-task', { ...props.taskToEdit, ...taskData.value });
    } else {
      emit('add-task', { ...taskData.value });
    }
    close();
  }
};

/**
 * モーダルを閉じるために 'close' イベントを発生させます。
 */
const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.32);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--md-surface-color);
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

h3 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 400;
}

.form-field {
  position: relative;
  margin-bottom: 24px;
}

.form-field input,
.form-field textarea {
  width: 100%;
  box-sizing: border-box;
}

.form-field label {
  position: absolute;
  top: 12px;
  left: 12px;
  color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
  transition: all 0.2s ease-in-out;
}

.form-field input:focus+label,
.form-field input:not(:placeholder-shown)+label,
.form-field textarea:focus+label,
.form-field textarea:not(:placeholder-shown)+label {
  top: -10px;
  left: 8px;
  font-size: 0.75rem;
  color: var(--md-primary-color);
  background-color: var(--md-surface-color);
  padding: 0 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

button.text {
  background-color: transparent;
  color: var(--md-primary-color);
}

button.text:hover {
  background-color: rgba(98, 0, 238, 0.08);
}
</style>
