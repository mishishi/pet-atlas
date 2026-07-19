#!/usr/bin/env python3
"""
生成 25 个新品种的 6 张图 prompt 清单。

犬类(template=1): 14 个,基于拉布拉多模板改造
猫类(template=2): 11 个,基于 _template-2-cat.md

输出:scripts/atlas_requests.json
每项: { "slug", "template", "requests": [ {prompt, output_file_path} x 6 ] }
"""

import json
import os
import sys
from pathlib import Path

REPO = Path("/Users/zhurenbao/Jason/codex-workspace/pet-receiver")
PETS_DIR = REPO / "content" / "pets"
ART_DIR = REPO / "art"

# 共享色板字符串
PALETTE = "Color palette: oat #F5EFE0, sand #E8D9B8, warm brown #8B6F47, mint #A8C5A0."

# ============================================================
# 25 个品种的真实照片描述(英文,基于品种特征手写)
# ============================================================
REAL_PET_DESC_EN = {
    # 14 犬
    "golden-retriever": "a real Golden Retriever with golden long coat, friendly smile, feathered tail",
    "pembroke-welsh-corgi": "a real Pembroke Welsh Corgi with short legs, long body, large upright ears, foxy face",
    "shiba-inu": "a real Shiba Inu with alert expression, curled tail, red sesame coat, smiling face",
    "border-collie": "a real Border Collie with intense gaze, medium long black and white coat",
    "french-bulldog": "a real French Bulldog with flat face, bat ears, compact muscular body, brindle coat",
    "bichon-frise": "a real Bichon Frise with fluffy white powder-puff coat, round black eyes, friendly smile",
    "toy-poodle": "a real Toy Poodle with curly apricot or white coat, small delicate frame, intelligent eyes",
    "siberian-husky": "a real Siberian Husky with striking blue or bi-colored eyes, black and white mask coat",
    "pomeranian": "a real Pomeranian with fluffy fox-like orange coat, tiny ears, bright eyes",
    "miniature-schnauzer": "a real Miniature Schnauzer with bushy eyebrows and beard, salt and pepper wiry coat",
    "dachshund": "a real Dachshund with very long body, short legs, smooth red or tan coat, soulful eyes",
    "alaskan-malamute": "a real Alaskan Malamute with massive powerful build, thick gray and white coat, plumed tail over back",
    "samoyed": "a real Samoyed with pure white fluffy double coat, signature upturned smile, dark eyes",
    "chihuahua": "a real Chihuahua with apple-shaped head, large round eyes, tiny body, smooth short coat",
    # 11 猫
    "american-shorthair": "a real American Shorthair cat with classic silver tabby pattern, round face, muscular build",
    "ragdoll": "a real Ragdoll cat with color point pattern, striking blue eyes, semi-long silky coat, relaxed floppy posture",
    "siamese": "a real Siamese cat with color points (dark face/ears/paws), blue almond eyes, slender elegant body",
    "orange-tabby": "a real orange tabby cat with classic mackerel tabby stripes, golden eyes, plump cheeks",
    "chinese-li-hua": "a real Chinese Li Hua cat with brown mackerel tabby coat, strong athletic body, wild look",
    "persian": "a real Persian cat with flat face, long fluffy coat, big round copper eyes",
    "exotic-shorthair": "a real Exotic Shorthair cat with flat face, plush short coat, big round eyes, teddy bear look",
    "persian-silver-chinchilla": "a real Silver Chinchilla Persian cat with shimmering silver-white coat, emerald green eyes, flat face",
    "sphynx": "a real Sphynx cat with hairless wrinkled skin, large bat ears, slender muscular body, warm to the touch",
    "maine-coon": "a real Maine Coon with massive size, tufted ears, long fluffy tail, gentle giant expression",
    "abyssinian": "a real Abyssinian cat with ruddy agouti ticked coat, alert large ears, athletic graceful body",
}

# ============================================================
# 历史时间线 4 节点选择(从 JSON 抽 4 个,前 4 个)
# ============================================================
def history_4nodes(pet):
    """从 history.timeline 取前 4 个节点。返回 [{year, event}, ...]"""
    tl = pet.get("history", {}).get("timeline", [])
    if not tl:
        return [
            {"year": "—", "event": "起源不明"},
            {"year": "—", "event": "近代发展"},
            {"year": "—", "event": "正式认证"},
            {"year": "—", "event": "现代推广"},
        ]
    n = tl[:4] if len(tl) >= 4 else tl
    while len(n) < 4:
        n.append({"year": "—", "event": "—"})
    return n


# ============================================================
# 犬类 6 张 prompt 生成(模板 1)
# ============================================================
def dog_cover(slug, pet):
    p = pet["physical"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    country = pet["origin"]["country"]
    region = pet["origin"].get("region", country)
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, cover page of a pet encyclopedia visual atlas for {name_en}. "
        f"Healing hand-drawn style with watercolor illustration + real pet photo. "
        f"Top 60%: {real_desc} standing or sitting in soft oat background with watercolor leaf decorations, "
        f"looking at camera, warm natural light. "
        f"Bottom 40%: oat background with hand-drawn watercolor paw prints and leaves, "
        f"breed name '{name_zh}' in bold rounded Chinese font, latin name '{name_en}' in handwritten English, "
        f"origin chip '原产地 · {country}{region}', small icon row with size/weight/lifespan icons. "
        f"{PALETTE} "
        f"Style: museum-quality pet portrait + healing watercolor + info graphic clarity, "
        f"suitable as a 9:16 shareable visual."
    )


def dog_traits(slug, pet):
    p = pet["physical"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 2 'Physical Traits' of a pet encyclopedia visual atlas for {name_en}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: page indicator '2 / 6' in warm brown, section title '形态特征 · Traits' in rounded Chinese. "
        f"Main: clean comparison table with 5 rows. "
        f"Row 1: 身高 {p['heightCm']}cm with small dog silhouette ruler icon. "
        f"Row 2: 体重 {p['weightKg']}kg with kettlebell icon. "
        f"Row 3: 寿命 {p['lifespanYears']}年 with hourglass icon. "
        f"Row 4: 被毛 {p['coat']} with fur texture illustration. "
        f"Row 5: 眼睛 {','.join(p['eyeColors'])} with eye color circles. "
        f"Each row has hand-drawn watercolor accents. "
        f"Bottom: small {real_desc} profile photo with watercolor edges. "
        f"{PALETTE} "
        f"Style: museum infographic + healing watercolor + iOS clarity."
    )


def dog_personality(slug, pet):
    p = pet["personality"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    avg = round((p["affection"] + p["activity"] + p["obedience"] + p["independence"] + p["vocalization"] + p["intelligence"]) / 6, 1)
    summary = p["summary"]
    return (
        f"9:16 vertical visual design, page 3 'Personality Radar' of a pet encyclopedia visual atlas for {name_en}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '3 / 6' in warm brown, section title '性格雷达 · Personality' in rounded Chinese. "
        f"Main center: 6-axis personality radar chart with watercolor edges and clean data lines. "
        f"Axes labels in Chinese: 亲人度 {p['affection']}/10, 活跃度 {p['activity']}/10, "
        f"服从度 {p['obedience']}/10, 独立性 {p['independence']}/10, 吠叫度 {p['vocalization']}/10, 智商值 {p['intelligence']}/10. "
        f"Each axis has a small icon. "
        f"Right side info card: '综合评分 {avg}/10' and subtitle '{summary}'. "
        f"Background: oat #F5EFE0 with subtle hand-drawn leaves. "
        f"{PALETTE} "
        f"Style: museum infographic + healing watercolor."
    )


def dog_history(slug, pet):
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    nodes = history_4nodes(pet)
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 4 'Evolution History' of a pet encyclopedia visual atlas for {name_en}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '4 / 6' in warm brown, section title '演化历史 · History' in rounded Chinese. "
        f"Main: hand-drawn horizontal timeline with 4 milestone nodes. "
        f"Node 1: {nodes[0]['year']} '{nodes[0]['event']}' with small fishing boat / ancient icon. "
        f"Node 2: {nodes[1]['year']} '{nodes[1]['event']}' with Victorian frame icon. "
        f"Node 3: {nodes[2]['year']} '{nodes[2]['event']}' with badge icon. "
        f"Node 4: {nodes[3]['year']} '{nodes[3]['event']}' with modern house icon. "
        f"Each node has a small Chinese description. "
        f"Bottom right: small {real_desc} head photo. "
        f"Background: oat #F5EFE0. {PALETTE} "
        f"Style: museum timeline illustration + healing watercolor."
    )


def dog_care(slug, pet):
    c = pet["care"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 5 'Care Guide' of a pet encyclopedia visual atlas for {name_en}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '5 / 6' in warm brown, section title '养护指南 · Care Guide' in rounded Chinese. "
        f"Main: 4 cards in 2x2 grid. "
        f"Card 1: '饮食 Diet' with bowl icon, text '{c['diet']}'. "
        f"Card 2: '运动 Exercise' with running dog icon, text '{c['exercise']}'. "
        f"Card 3: '医疗 Health' with stethoscope icon, text '{c['health']}'. "
        f"Card 4: '训练 Training' with paw icon, text '{c['training']}'. "
        f"Each card has a soft watercolor background. "
        f"Bottom: small {real_desc} photo. {PALETTE} "
        f"Style: museum card design + healing watercolor."
    )


def dog_famous(slug, pet):
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    famous = pet.get("famous", [])[:4]
    while len(famous) < 4:
        famous.append("—")
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 6 'Famous Moments' of a pet encyclopedia visual atlas for {name_en}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '6 / 6' in warm brown, section title '名场面 · Famous Moments' in rounded Chinese. "
        f"Main: collage of 4 hand-drawn watercolor vignettes. "
        f"Vignette 1: '{famous[0]}' with star icon. "
        f"Vignette 2: '{famous[1]}' with movie reel icon. "
        f"Vignette 3: '{famous[2]}' with badge icon. "
        f"Vignette 4: '{famous[3]}' with sparkle icon. "
        f"Each has a small Chinese handwritten caption. "
        f"Bottom: real {real_desc} photo. "
        f"Background: oat #F5EFE0 with watercolor confetti decorations. {PALETTE} "
        f"Style: museum storyboard + healing watercolor."
    )


# ============================================================
# 猫类 6 张 prompt 生成(模板 2)
# 性格 6 维:亲人度/活跃度/独立性/智商/话多/粘人(粘人=JSON.obedience)
# ============================================================
def cat_cover(slug, pet):
    p = pet["physical"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    country = pet["origin"]["country"]
    region = pet["origin"].get("region", country)
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, cover page of a pet encyclopedia visual atlas for {name_zh} ({name_en}). "
        f"Healing hand-drawn style with watercolor illustration + real cat photo. "
        f"Top 50%: {real_desc} in elegant pose (sitting or side profile) with bright clear eyes, "
        f"soft natural light, on oat background with watercolor cat paw print decorations. "
        f"Bottom 50%: oat background with hand-drawn watercolor whiskers, fish bones, cat toys, and leaves. "
        f"Breed name '{name_zh}' in bold rounded Chinese font, latin name '{name_en}' in handwritten English, "
        f"origin chip '原产地 · {country}{region}', small icon row with size/weight/lifespan. "
        f"{PALETTE} "
        f"Style: museum-quality cat portrait + healing watercolor + info graphic clarity."
    )


def cat_traits(slug, pet):
    p = pet["physical"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 2 'Physical Traits' of a pet encyclopedia visual atlas for {name_zh}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: page indicator '2 / 6' in warm brown, section title '形态特征 · Traits' in rounded Chinese. "
        f"Main: clean comparison table with 5 rows. "
        f"Row 1: 身高 {p['heightCm']}cm with small cat silhouette ruler icon. "
        f"Row 2: 体重 {p['weightKg']}kg with scale icon. "
        f"Row 3: 寿命 {p['lifespanYears']}年 with hourglass icon. "
        f"Row 4: 被毛 {p['coat']} with fur texture illustration. "
        f"Row 5: 眼睛 {','.join(p['eyeColors'])} with eye color circles. "
        f"Each row has hand-drawn watercolor accents. "
        f"Bottom: small {real_desc} profile photo with watercolor edges. {PALETTE} "
        f"Style: museum infographic + healing watercolor."
    )


def cat_personality(slug, pet):
    p = pet["personality"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    # 猫 6 维:亲人度/活跃度/独立性/智商/话多/粘人(粘人=obedience)
    aff = p["affection"]
    act = p["activity"]
    ind = p["independence"]
    intel = p["intelligence"]
    voc = p["vocalization"]
    clingy = p["obedience"]  # 模板 2 用 obedience 作为粘人
    avg = round((aff + act + ind + intel + voc + clingy) / 6, 1)
    summary = p["summary"]
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 3 'Personality Radar' of a pet encyclopedia visual atlas for {name_zh}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '3 / 6' in warm brown, section title '性格雷达 · Personality' in rounded Chinese. "
        f"Main center: 6-axis personality radar chart with watercolor edges and clean data lines. "
        f"Axes labels in Chinese: 亲人度 {aff}/10, 活跃度 {act}/10, 独立性 {ind}/10, "
        f"智商 {intel}/10, 话多 {voc}/10, 粘人 {clingy}/10. "
        f"Each axis has a small cat-related icon. "
        f"Right side info card: '综合评分 {avg}/10' and subtitle '{summary}'. "
        f"Background: oat #F5EFE0 with subtle hand-drawn fish bones and cat toys. {PALETTE} "
        f"Style: museum infographic + healing watercolor."
    )


def cat_history(slug, pet):
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    nodes = history_4nodes(pet)
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 4 'Evolution History' of a pet encyclopedia visual atlas for {name_zh}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '4 / 6' in warm brown, section title '演化历史 · History' in rounded Chinese. "
        f"Main: hand-drawn horizontal timeline with 4 milestone nodes. "
        f"Node 1: {nodes[0]['year']} '{nodes[0]['event']}' with small ancient/animal icon. "
        f"Node 2: {nodes[1]['year']} '{nodes[1]['event']}' with Victorian frame icon. "
        f"Node 3: {nodes[2]['year']} '{nodes[2]['event']}' with badge icon. "
        f"Node 4: {nodes[3]['year']} '{nodes[3]['event']}' with modern house icon. "
        f"Each node has a small Chinese description. "
        f"Bottom right: small {real_desc} head photo. "
        f"Background: oat #F5EFE0. {PALETTE} "
        f"Style: museum timeline illustration + healing watercolor."
    )


def cat_care(slug, pet):
    c = pet["care"]
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 5 'Care Guide' of a pet encyclopedia visual atlas for {name_zh}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '5 / 6' in warm brown, section title '养护指南 · Care Guide' in rounded Chinese. "
        f"Main: 4 cards in 2x2 grid. "
        f"Card 1: '饮食 Diet' with bowl icon, text '{c['diet']}'. "
        f"Card 2: '运动 Exercise' with running cat icon, text '{c['exercise']}'. "
        f"Card 3: '医疗 Health' with stethoscope icon, text '{c['health']}'. "
        f"Card 4: '美容 Grooming' with comb icon, text '{c['training']}'. "
        f"Each card has a soft watercolor background. "
        f"Bottom: small {real_desc} photo. {PALETTE} "
        f"Style: museum card design + healing watercolor."
    )


def cat_famous(slug, pet):
    name_zh = pet["name"]["zh"]
    name_en = pet["name"]["en"]
    famous = pet.get("famous", [])[:4]
    while len(famous) < 4:
        famous.append("—")
    real_desc = REAL_PET_DESC_EN[slug]
    return (
        f"9:16 vertical visual design, page 6 'Famous Moments' of a pet encyclopedia visual atlas for {name_zh}. "
        f"Healing hand-drawn style with watercolor illustration + flat info graphic. "
        f"Top: small dot indicator '6 / 6' in warm brown, section title '名场面 · Famous Moments' in rounded Chinese. "
        f"Main: collage of 4 hand-drawn watercolor vignettes. "
        f"Vignette 1: '{famous[0]}' with star icon. "
        f"Vignette 2: '{famous[1]}' with cat paw icon. "
        f"Vignette 3: '{famous[2]}' with badge icon. "
        f"Vignette 4: '{famous[3]}' with sparkle icon. "
        f"Each has a small Chinese handwritten caption. "
        f"Bottom: real {real_desc} photo. "
        f"Background: oat #F5EFE0 with watercolor confetti decorations. {PALETTE} "
        f"Style: museum storyboard + healing watercolor."
    )


# ============================================================
# 主流程
# ============================================================
DOG_SLUGS = [
    "golden-retriever", "pembroke-welsh-corgi", "shiba-inu", "border-collie",
    "french-bulldog", "bichon-frise", "toy-poodle", "siberian-husky",
    "pomeranian", "miniature-schnauzer", "dachshund", "alaskan-malamute",
    "samoyed", "chihuahua",
]

CAT_SLUGS = [
    "american-shorthair", "ragdoll", "siamese", "orange-tabby",
    "chinese-li-hua", "persian", "exotic-shorthair", "persian-silver-chinchilla",
    "sphynx", "maine-coon", "abyssinian",
]

SLOT_KEYS = ["cover", "traits", "personality", "history", "care", "famous"]


def gen_breed_requests(slug, template):
    pet_path = PETS_DIR / f"{slug}.json"
    with open(pet_path, "r", encoding="utf-8") as f:
        pet = json.load(f)

    if template == 1:
        builders = [dog_cover, dog_traits, dog_personality, dog_history, dog_care, dog_famous]
    else:
        builders = [cat_cover, cat_traits, cat_personality, cat_history, cat_care, cat_famous]

    requests = []
    for i, builder in enumerate(builders, start=1):
        slot = SLOT_KEYS[i - 1]
        idx = str(i).zfill(2)
        prompt = builder(slug, pet)
        out_path = f"art/{slug}-atlas-{idx}-{slot}.png"
        requests.append({
            "prompt": prompt,
            "output_file_path": out_path,
        })
    return requests


def main():
    result = []
    for slug in DOG_SLUGS:
        result.append({
            "slug": slug,
            "template": 1,
            "category": "dog",
            "requests": gen_breed_requests(slug, 1),
        })
    for slug in CAT_SLUGS:
        result.append({
            "slug": slug,
            "template": 2,
            "category": "cat",
            "requests": gen_breed_requests(slug, 2),
        })

    out_path = REPO / "scripts" / "atlas_requests.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"已生成 {len(result)} 个品种的 prompt 清单")
    print(f"  犬类: {len(DOG_SLUGS)}")
    print(f"  猫类: {len(CAT_SLUGS)}")
    print(f"  总 prompt 数: {sum(len(r['requests']) for r in result)}")
    print(f"输出: {out_path}")


if __name__ == "__main__":
    main()
