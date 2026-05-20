# ValorizeAI 記事運用ダッシュボード

GitHub Pagesで共有する、note記事制作の会議用ダッシュボードです。

## 運用

- ローカル管理表は `../data/*.md` で管理します。
- `../scripts/build_static_site.py` を実行すると、この `salesblog/` 配下のHTMLが生成されます。
- トップページではタイトル案の採用可否とコメントを入力できます。
- 入力内容はブラウザ内に保存され、Markdownとして書き出せます。
- 書き出したMarkdownは `../data/meeting_decisions/` に保存し、Codexが管理表へ反映します。
- 各HTMLには `noindex, nofollow` を設定します。

## GitHub Pages

想定公開URL:

`https://daisuke-saito1020.github.io/salesblog/`
