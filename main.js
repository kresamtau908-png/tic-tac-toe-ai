// *ゲームの状態
const CONTINUE = null; // まだ決着がついていない
const WIN_PLAYER_1 = 1; // 〇の勝ち
const WIN_PLAYER_2 = -1; //✕の勝ち
const DRAW_GAME = 0; //引き分け

const cells = [ //空なら０、〇なら１、✕なら-１
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
]

//cells[2][0] = "ピンク";
//console.log(cells[2][0]);

let turn = 1; // 〇の順番なら１、✕の順番なら-１
let result = CONTINUE; // 勝敗
let mode = "hard"; // 思考モード

// *セルをクリックしたときのイベントを登録
// row = 行
for (let row = 0; row < 3; row++) {
  //console.log({row});
  //col = 列
  for (let col = 0; col < 3; col++) {
    //console.log({col});

    //９つのセルを取得
    const cell = document.querySelector(`#cell_${row}_${col}`);
    //console.log(`#cell_${row}_${col}`);
    //console.log(cell)
    cell.addEventListener("click", () => { // アロー関数
      if (result !== CONTINUE) {
        window.location.reload(); //決着がついた後にクリックしたらリロード
        return;
      }
      if (cells[row][col] === 0) {
        putMark(row, col);// 〇を置く
        turn = turn * -1;
        thinkAI();//AIに考えてもらう
        turn = turn * -1;

        check();// ゲームの状態を確認
      }
    });
  }
}

// * モードが切り替わった時の処理
const modeElements = document.querySelectorAll("input[name='mode']");
for (let modeElement of modeElements) {
  modeElement.addEventListener("change", (event) => {
    mode = event.target.value;
    document.querySelector("#back").classList = mode;
  });
}

// *〇か✕を置く
function putMark(row, col) {
  const cell = document.querySelector(`#cell_${row}_${col}`);
  if (turn === 1) {
    // 〇の番だったら
    cell.textContent = "〇";// セルに〇を置く
    cell.classList.add("o");// セルにクラスを追加
    cells[row][col] = 1;// 勝敗判定用に記録
  } else {
    // ✕の番だったら
    cell.textContent = "✕";// セルに✕を置く
    cell.classList.add("x");// セルにクラスを追加
    cells[row][col] = -1;// 勝敗判定用に記録
  }
  //console.log(cell);
}

// *ゲームの状態を確認
function check() {
  result = judge(cells);// 勝敗を上書き
  const message = document.querySelector("#message");
  switch (result) {
    case WIN_PLAYER_1:
      message.textContent = "〇の勝ち！";
      break;
    case WIN_PLAYER_2:
      message.textContent = "✕の勝ち！";
      break;
    case DRAW_GAME:
      message.textContent = "引き分け！";
      break;
  }
}

// *勝敗を判定する処理
function judge(_cells) {
  // 調べる必要があるラインをリストアップ
  const lines = [
    // 横をチェック
    [_cells[0][0], _cells[0][1], _cells[0][2]],
    [_cells[1][0], _cells[1][1], _cells[1][2]],
    [_cells[2][0], _cells[2][1], _cells[2][2]],
    // 縦をチェック
    [_cells[0][0], _cells[1][0], _cells[2][0]],
    [_cells[0][1], _cells[1][1], _cells[2][1]],
    [_cells[0][2], _cells[1][2], _cells[2][2]],
    // 斜めをチェック
    [_cells[0][0], _cells[1][1], _cells[2][2]],
    [_cells[0][2], _cells[1][1], _cells[2][0]],
  ]
  // 勝ち負けチェック
  for (let line of lines) {
    const sum = line[0] + line[1] + line[2];
    //console.log({sum});
    if (sum === 3) {
      //console.log("〇の勝ち！");
      return WIN_PLAYER_1;
    }
    if (sum === -3) {
      //console.log("✕の勝ち！");
      return WIN_PLAYER_2;
    }
  }
  // 継続チェック
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (_cells[row][col] === 0) {
        // 空欄のセルがあるとき
        //console.log("継続")
        return CONTINUE;
      }
    }
  }
  // 引き分け判定
  //console.log("引き分け！");
  return DRAW_GAME;
}

// * AIに考えてもらう
function thinkAI() {
  const hand = think(cells, -1, 9, mode === "easy");
  if (hand) {
    const cell = document.querySelector(`#cell_${hand[0]}_${hand[1]}`);
    cell.textContent = "✕";
    cell.classList.add("x");
    cells[hand[0]][hand[1]] = -1;
  }
}