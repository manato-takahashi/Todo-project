import { useState } from "react";

// "Todo型" の定義
type Todo = {
  value: string;
  readonly id: number;
}

export const App = () => {
  // 初期値: 空文字列 ''
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

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

  return (
    <div>
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
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
              type="text"
              value={todo.value}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};