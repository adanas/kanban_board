// store.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useStore } from "./store";
// import { ref } from 'vue';

// localStorageのモック
// ブラウザ環境のlocalStorageをシミュレートするためのモックオブジェクト
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

// windowオブジェクトにモックのlocalStorageを定義
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// useStore コンポーザブルのテストスイート
describe("useStore", () => {
  // 各テストが実行される前に、状態をリセットする
  beforeEach(() => {
    // localStorageをクリア
    localStorage.clear();
    // モジュールをリセットして、キャッシュされたストアの状態をクリア
    vi.resetModules();
    // useStoreからタスクを取得し、初期値を設定
    const { tasks } = useStore();
    tasks.value = [
      {
        id: 1,
        name: "Task 1",
        description: "Desc 1",
        statusId: 1,
        dueDate: "2024-01-01",
      },
      { id: 2, name: "Task 2", description: "Desc 2", statusId: 2 },
    ];
  });

  // addNewTask関数のテスト
  it("addNewTaskは新しいタスクを正しく追加する", () => {
    const { tasks, addNewTask } = useStore();
    const initialLength = tasks.value.length;
    const newTaskData = {
      name: "New Task",
      description: "A brand new task",
      dueDate: "2025-01-01",
    };

    // 新しいタスクを追加
    addNewTask(newTaskData);

    // タスクの数が1つ増えたことを確認
    expect(tasks.value.length).toBe(initialLength + 1);
    // 追加されたタスクのプロパティが正しいことを確認
    const addedTask = tasks.value[tasks.value.length - 1];
    expect(addedTask.name).toBe(newTaskData.name);
    expect(addedTask.description).toBe(newTaskData.description);
    expect(addedTask.statusId).toBe(1); // デフォルトステータスが「新規」であることを確認
  });

  // editTask関数のテスト
  it("editTaskは既存のタスクを正しく更新する", () => {
    const { tasks, editTask } = useStore();
    const updatedTask = {
      id: 1,
      name: "Task 1 Updated",
      description: "Desc 1 Updated",
      statusId: 3,
      dueDate: "2024-01-15",
    };

    // タスクを更新
    editTask(updatedTask);

    // 更新されたタスクが正しく反映されていることを確認
    const task = tasks.value.find((t) => t.id === 1);
    expect(task).toEqual(updatedTask);
  });

  // deleteTask関数のテスト
  it("deleteTaskは指定されたタスクを正しく削除する", () => {
    const { tasks, deleteTask } = useStore();
    const taskIdToDelete = 1;
    const initialLength = tasks.value.length;

    // タスクを削除
    deleteTask(taskIdToDelete);

    // タスクの数が1つ減ったことを確認
    expect(tasks.value.length).toBe(initialLength - 1);
    // 削除されたタスクが存在しないことを確認
    expect(tasks.value.find((t) => t.id === taskIdToDelete)).toBeUndefined();
  });
});
