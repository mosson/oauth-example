// How to run this test:
// ```
// $ deno test --unstable --allow-net --allow-read client_server_test.ts
// ```

// refs: https://dev.to/wongjiahau/how-to-test-server-in-vanilla-deno-4m1e
import { assertEquals } from "https://deno.land/std@0.103.0/testing/asserts.ts";
import { Status } from "https://deno.land/std@0.103.0/http/http_status.ts";

const serverPath = new URL("./client_server.ts", import.meta.url).href;

// ワーカースレッドでサーバーを実行する
const worker = new Worker(serverPath, { type: "module", deno: true });

// サーバーが立ち上がるまで少し待つ
await new Promise((resolve) => setTimeout(resolve, 3000));

const tests: {
  name: string;
  fn: () => Promise<void>;
}[] = [
  {
    name: "認可サーバーにリダイレクトする",
    fn: async () => {
      const response = await fetch("http://localhost:8000/", {redirect: 'manual'});
      assertEquals(response.status, Status.Found);
      assertEquals(
        response.headers.get("Location"),
        "http://localhost:8001",
      );
    },
  },
];

// testsが全件終了したらワーカースレッドを終了
let numberOfRanTest = 0;
const done = () => {
  numberOfRanTest++;
  if (numberOfRanTest === tests.length) {
    worker.terminate();
  }
};

tests.forEach((test) => {
  Deno.test({
    name: test.name,

    // テストケース終了で終了カウントを増加させる => テスト自体の終了のため
    fn: () => test.fn().then(done),

    // We need to set these options to false such that the test can exit with status 0
    sanitizeOps: false,
    sanitizeResources: false,
  });
});
