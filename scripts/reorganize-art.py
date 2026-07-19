#!/usr/bin/env python3
"""
重组 art 目录结构:
  art/_design/                ← 4 张设计稿
  art/dog/{slug}/             ← 犬类
  art/cat/{slug}/             ← 猫类
  art/small-mammal/{slug}/    ← 小型哺乳
  art/bird-reptile/{slug}/    ← 鸟+爬宠
"""
import json
import os
import shutil
from pathlib import Path

ROOT = Path("/Users/zhurenbao/Jason/codex-workspace/pet-receiver")
ART = ROOT / "art"
PETS = ROOT / "content" / "pets"
DESIGN_DIR = ART / "_design"

# 4 张设计稿(平铺文件,原名不变)
DESIGN_FILES = [
    "01-storefront.png",
    "02-home.png",
    "03-breed-detail.png",
    "04-atlas-personality.png",
]

# category slug → 目录名
CATEGORY_DIR = {
    "dog": "dog",
    "cat": "cat",
    "small-mammal": "small-mammal",
    "bird": "bird-reptile",
    "reptile": "bird-reptile",
}

# atlas slot 顺序(英文 key,文件名用)
SLOT_KEYS = ["cover", "traits", "personality", "history", "care", "famous"]


def main():
    # Step 1: 建所有目录
    DESIGN_DIR.mkdir(parents=True, exist_ok=True)
    print(f"✓ Created {DESIGN_DIR}")

    # 读所有 pet JSON,建 category 目录
    pets = []
    for jf in sorted(PETS.glob("*.json")):
        with open(jf, "r", encoding="utf-8") as f:
            pet = json.load(f)
        if pet.get("status") != "published":
            continue
        slug = pet["slug"]
        category = pet.get("category", "dog")
        dir_name = CATEGORY_DIR.get(category, "small-mammal")
        breed_dir = ART / dir_name / slug
        breed_dir.mkdir(parents=True, exist_ok=True)
        pets.append((slug, dir_name, category))

    # Step 2: 移动设计稿
    for fname in DESIGN_FILES:
        src = ART / fname
        if not src.exists():
            print(f"⚠  设计稿 {fname} 不存在,跳过")
            continue
        dst = DESIGN_DIR / fname
        if dst.exists():
            print(f"  · {dst.name} 已存在,跳过")
        else:
            shutil.move(str(src), str(dst))
            print(f"✓ {fname} → _design/{fname}")

    # Step 3: 移动图谱
    # 原命名规则:labrador 用 atlas-NN-*.png,其他用 {slug}-atlas-NN-*.png
    moved = 0
    for slug, dir_name, category in pets:
        breed_dir = ART / dir_name / slug
        for i, key in enumerate(SLOT_KEYS, start=1):
            nn = f"{i:02d}"
            # 两种可能的原文件名
            candidates = [
                f"{slug}-atlas-{nn}-{key}.png",  # 新规则
                f"atlas-{nn}-{key}.png",         # 拉布拉多特殊规则(无 slug 前缀)
            ]
            src = None
            for cand in candidates:
                p = ART / cand
                if p.exists():
                    src = p
                    break
            if src is None:
                continue  # 无图,跳过
            dst = breed_dir / f"{nn}-{key}.png"
            if dst.exists():
                print(f"  · {dst.relative_to(ART)} 已存在,跳过")
            else:
                shutil.move(str(src), str(dst))
                moved += 1
                if moved % 12 == 0:
                    print(f"  ... 已移动 {moved} 张")

    # Step 4: 验证 — 列出空目录(无图的品种)
    empty = []
    for slug, dir_name, category in pets:
        breed_dir = ART / dir_name / slug
        if not any(breed_dir.glob("*.png")):
            empty.append(f"{dir_name}/{slug}")

    print()
    print(f"✅ 移动完成:共 {moved} 张图谱")
    print(f"📁 新结构:")
    for d in sorted(set(p[1] for p in pets)):
        count = sum(1 for p in pets if p[1] == d)
        filled = sum(
            1
            for p in pets
            if p[1] == d and any((ART / p[1] / p[0]).glob("*.png"))
        )
        print(f"  art/{d}/  ({count} 个品种, {filled} 个有图)")
    print(f"  art/_design/  ({len(DESIGN_FILES)} 张设计稿)")
    if empty:
        print()
        print(f"⏳ 等明天补图的品种(无图,{len(empty)} 个):")
        for e in empty[:10]:
            print(f"  - {e}")
        if len(empty) > 10:
            print(f"  ... 还有 {len(empty) - 10} 个")


if __name__ == "__main__":
    main()
