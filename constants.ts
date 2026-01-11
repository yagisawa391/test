
import { Product } from './types';

/**
 * ==========================================
 * 【商品の管理ガイド (編集・追加・削除)】
 * ==========================================
 * 
 * 1. 追加する方法:
 *    下記の `PRODUCTS` 配列の中に新しい `{ ... }` ブロックを作成します。
 *    IDは重複しないように注意してください。
 * 
 * 2. 編集する方法:
 *    既存の項目の値を書き換えます。
 *    - name: 表示名
 *    - price: 数値（カンマなしの数値で入力）
 *    - category: フィルター用のカテゴリ名（現在は「香水」または「化粧品」）
 *    - image: Unsplashなどの画像URL
 * 
 * 3. 削除する方法:
 *    対象の商品ブロック（ { から } まで）を削除します。
 */

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ルミナ・オー・ド・パルファム',
    price: 32000,
    category: '香水',
    description: '月明かりに照らされた夜の庭園をイメージした、神秘的で洗練された香り。ベルガモットと希少なホワイトウードが調和します。',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    color: 'ゴールド',
    rating: 4.9
  },
  {
    id: '2',
    name: 'シルク・リバイバル・セラム',
    price: 18500,
    category: '化粧品',
    description: '細胞レベルから輝きを。最先端のバイオテクノロジーを用いた、肌の密度を高める高機能美容液。',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?auto=format&fit=crop&q=80&w=800',
    color: 'クリア',
    rating: 4.8
  },
  {
    id: '3',
    name: 'ネビュラ・ミスト・エッセンス',
    price: 12000,
    category: '化粧品',
    description: '極小の分子が肌の深部まで浸透。24時間潤いを逃さない、究極の保湿ミスト。',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    color: 'パールホワイト',
    rating: 4.7
  },
  {
    id: '4',
    name: 'オブシディアン・ノワール',
    price: 45000,
    category: '香水',
    description: '強さと繊細さを併せ持つ、ウッディでスモーキーな香り。自信に満ち溢れた夜にふさわしい逸品。',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    color: 'ブラック',
    rating: 5.0
  },
  {
    id: '5',
    name: 'ベルベット・フィニッシュ・クリーム',
    price: 26000,
    category: '化粧品',
    description: 'まるでベルベットのような質感へ。肌表面を整え、内側から発光するようなツヤを与えます。',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    color: 'ピンクゴールド',
    rating: 4.6
  },
  {
    id: '6',
    name: 'エリアル・フローラル・ウォーター',
    price: 28000,
    category: '香水',
    description: '摘みたてのジャスミンとローズが、空気に溶け込むような軽やかさで広がります。',
    image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&q=80&w=800',
    color: 'ローズ',
    rating: 4.9
  }
];
