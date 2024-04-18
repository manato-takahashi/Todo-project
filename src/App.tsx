import { useState } from "react";

// "Todo型" の定義
type Todo = {
  value: string;
  readonly id: number;
  // タスクの完了/未完了を示すプロパティ
  checked: boolean;
  removed: boolean;
};

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

export const App = () => {
  // 初期値: 空文字列 ''
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  // todos ステートを更新する関数
  const handleSubmit = () => {
    // 何も入力されていなかったらreturn
    if (!text) return;

    // 新しい Todo を作成
    // 明示的に型注釈を付けてオブジェクトの型を指定する
    const newTodo: Todo = {
      // text ステートの値を value プロパティへ
      value: text,
      /**
       * Todo型オブジェクトの型定義が更新されたため、
       * number型の id プロパティの存在が必須になった
       */
      id: new Date().getTime(),
      // 初期値（todo 作成時）は false
      checked: false,
      removed: false,
    };

    /**
     * 更新前の todos ステートをもとに
     * スプレッド構文で展開した要素へ
     * newTodo を加えた新しい配列でステートを更新
     **/
    setTodos((todos) => [newTodo, ...todos]);
    // フォームへの入力をクリアする
    setText('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      /**
       * 引数として渡された todo の id が一致する
       * 更新前の todos ステート内の todo の
       * value プロパティを引数 value (= e.target.value) に更新
       */
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          /**
           * この階層でオブジェクト todo をコピー・展開し、
           * その中で value プロパティを引数で上書きする
           * コピーを作って、コピーの方を更新することでイミュータブル（不変）な更新を実現するイメージ
           */
          return { ...todo, value: value };
        }
        return todo;
      });

      // todos ステートを更新
      return newTodos;
    });
  };

  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked: checked };
        }
        return todo;
      });
      return newTodos;
    });
  };

  const handleRemove = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, removed: removed };
        }
        return todo;
      });
      return newTodos;
    });
  };

  const handleSort = (filter: Filter) => {
    setFilter(filter);
  };

  const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case 'all':
        // 削除されていないもの
        return !todo.removed;
      case 'checked':
        // 完了済み **かつ** 削除されていないもの
        return todo.checked && !todo.removed;
      case 'unchecked':
        // 未完了 **かつ** 削除されていないもの
        return !todo.checked && !todo.removed;
      case 'removed':
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

  const handleEmpty = () => {
    // シャロ―コピーで事足りる
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  return (
    <div>
      <select 
        defaultValue="all" 
        onChange={(e) => handleSort(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      {/* フィルターが removed の時は「ごみ箱を空にする」ボタンを表示 */}
      {filter === 'removed' ? (
        <button 
          onClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ごみ箱を空にする
        </button>
      ) : (
        // フィルターが checked でなければ Todo 入力フォームを表示
        filter !== 'checked' && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="text" 
              // text ステートが持っている入力中のテキストの値を value として表示
              value={text}
              // onChange イベント （＝入力テキストの変化）を text ステートに反映する
              onChange={(e) => handleChange(e)} />
            <input
              type="submit"
              value="追加"
              onSubmit={handleSubmit}
            />
          </form>
        )
      )}
      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                // 呼び出し側で checked フラグを反転させる
                onChange={() => handleCheck(todo.id, !todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleEdit(todo.id, e.target.value)}
              />
              <button onClick={() => handleRemove(todo.id, !todo.removed)}>
                {todo.removed ? '復元' : '削除'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};