// FireStoreエラーかどうかを判定する型ガード
export function isFireStoreError(
  err: unknown
): err is { code: string; message: string } {
  return typeof err === "object" && err !== null && "code" in err;
}

export function firebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/network-request-failed":
      return "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。";
    case "auth/weak-password":
      return "パスワードは6文字以上を入力してください。";
    case "auth/invalid-email":
      return "メールアドレスが正しくありません。";
    case "auth/email-already-in-use":
      return "メールアドレスがすでに使用されています。ログインするか別のメールアドレスで作成してください。";
    default:
      return "ログインに失敗しました。パスワードが間違っている可能性があります。通信環境がいい所で再度やり直してください";
  }
}
