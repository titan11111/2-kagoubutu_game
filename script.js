const bgm = document.getElementById('bgm');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

const titleScreen = document.getElementById('title-screen');
const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const restartBtn = document.getElementById("restart-btn");
const lineShareBtn = document.getElementById("line-share");

let isAudioStarted = false;
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let inExtraQuiz = false;

startBtn.addEventListener("click", () => {
    titleScreen.style.display = "none";
    quizContainer.style.display = "block";
    startQuiz();
    if (!isAudioStarted) {
        bgm.volume = 0.3;
        bgm.play();
        isAudioStarted = true;
    }
});

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startQuiz(extra = false) {
    inExtraQuiz = extra;
    if (extra) {
        currentQuiz = shuffleArray([...extraQuizData]).slice(0, 5);
    } else {
        currentQuiz = shuffleArray([...quizData]).slice(0, 10);
    }
    currentIndex = 0;
    score = 0;
    resultEl.style.display = "none";
    restartBtn.style.display = "none";
    lineShareBtn.style.display = "none";
    nextBtn.style.display = "none";
    feedbackEl.textContent = "";
    document.body.style.backgroundColor = "";
    loadQuestion();
}

function loadQuestion() {
    const quiz = currentQuiz[currentIndex];
    questionEl.textContent = `問題 ${currentIndex + 1}: ${quiz.question}`;
    choicesEl.innerHTML = "";

    const shuffledChoices = shuffleArray([...quiz.choices]);
    shuffledChoices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice";
        btn.textContent = choice;
        btn.onclick = () => selectAnswer(choice);
        choicesEl.appendChild(btn);
    });
}

function selectAnswer(choice) {
    const quiz = currentQuiz[currentIndex];
    if (choice === quiz.answer) {
        feedbackEl.textContent = `正解！ ${quiz.episode}`;
        score++;
        correctSound.play();
        flashScreen("#2ecc71");
    } else {
        feedbackEl.textContent = `不正解！ ${quiz.episode}`;
        wrongSound.play();
        flashScreen("#e74c3c");
    }
    Array.from(document.getElementsByClassName("choice")).forEach(btn => {
        btn.disabled = true;
    });
    if (currentIndex < currentQuiz.length - 1) {
        nextBtn.style.display = "inline-block";
    } else {
        nextBtn.textContent = "結果発表";
        nextBtn.style.display = "inline-block";
    }
}

function flashScreen(color) {
    document.body.style.transition = "background-color 0.3s";
    document.body.style.backgroundColor = color;
    setTimeout(() => {
        document.body.style.backgroundColor = "";
    }, 300);
}

nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < currentQuiz.length) {
        feedbackEl.textContent = "";
        nextBtn.style.display = "none";
        loadQuestion();
    } else {
        showResult();
    }
});

function getTitle(score, extra = false) {
    if (extra) {
        if (score === 5) {
            return { title: "メンデレーエフ", message: "完璧だ！！元素の周期表を作った天才だ！！未来の科学界のスターだ！！" };
        } else if (score >= 4) {
            return { title: "ラボアジエ", message: "質量保存の法則を発見した偉人！すばらしい研究心だ！！" };
        } else if (score >= 3) {
            return { title: "ボイル", message: "気体の法則を解き明かした探究者！よく頑張った！！もう少しでトップだ！！" };
        } else {
            return { title: "科学者の卵", message: "成長中の若き科学者！挑戦は続く！！次はもっと高みを目指そう！！" };
        }
    } else {
        if (score === 10) {
            return { title: "ニュートン", message: "完璧だ！！素晴らしい！！未来の大科学者だ！！" };
        } else if (score >= 7) {
            return { title: "ガリレオ", message: "すごいぞ！！君の探究心は本物だ！！最高だ！！" };
        } else if (score >= 4) {
            return { title: "パスカル", message: "いいぞ！！あと少しでトップだ！！がんばれ！！" };
        } else {
            return { title: "化学者見習い", message: "大丈夫！！未来はこれから！！どんどん挑戦しよう！！" };
        }
    }
}

function showResult() {
    const result = getTitle(score, inExtraQuiz);
    questionEl.textContent = "";
    choicesEl.innerHTML = "";
    feedbackEl.textContent = "";
    resultEl.style.display = "block";
    resultEl.innerHTML = `あなたの正解数は ${score} / ${currentQuiz.length} です！<br>きみは <strong>${result.title}</strong> だ！！<br>${result.message}`;

    const shareUrl = encodeURIComponent('https://yourname.github.io/quiz');
    const shareText = encodeURIComponent(`化合物クイズ${inExtraQuiz ? 'エクストラ' : ''}で${score}/${currentQuiz.length}正解！きみは${result.title}だ！！挑戦してみよう！`);
    lineShareBtn.href = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
    lineShareBtn.style.display = "inline-block";

    if (!inExtraQuiz && score === 10) {
        restartBtn.textContent = "エクストラクイズに進む";
        restartBtn.onclick = () => startQuiz(true);
    } else {
        restartBtn.textContent = "もう一回遊ぶ";
        restartBtn.onclick = () => startQuiz();
    }
    restartBtn.style.display = "inline-block";
}


const quizData = [
    { question: "H₂O はどれ？", choices: ["水", "二酸化炭素", "アンモニア", "塩化ナトリウム"], answer: "水", episode: "水は地球上の生命に不可欠で、化学式はH₂Oです。" },
    { question: "NaCl はどれ？", choices: ["酸素", "塩化ナトリウム", "黄鉄鉱", "石英"], answer: "塩化ナトリウム", episode: "塩化ナトリウムは食塩の主成分で、私たちの食生活に欠かせません。" },
    { question: "二酸化炭素の化学式はどれ？", choices: ["CO₂", "H₂O", "NH₃", "O₂"], answer: "CO₂", episode: "二酸化炭素は呼吸や燃焼で発生し、地球温暖化にも関わります。" },
    { question: "アンモニアの化学式はどれ？", choices: ["NaCl", "NH₃", "H₂O", "CO₂"], answer: "NH₃", episode: "アンモニアは肥料の原料として使われ、刺激臭があります。" },
    { question: "O₂ はどれ？", choices: ["酸素", "水", "二酸化炭素", "アンモニア"], answer: "酸素", episode: "酸素は私たちが呼吸する空気の約21%を占めています。" },
    { question: "SiO₂ はどれ？", choices: ["黄鉄鉱", "石英", "塩化ナトリウム", "酸素"], answer: "石英", episode: "石英はSiO₂からなる鉱物で、ガラスや時計に使われます。" },
    { question: "FeS₂ はどれ？", choices: ["黄鉄鉱", "石英", "酸素", "水"], answer: "黄鉄鉱", episode: "黄鉄鉱は“愚者の金”とも呼ばれ、金色の光沢があります。" },
    { question: "CO₂ はどれ？", choices: ["二酸化炭素", "酸素", "水", "塩化ナトリウム"], answer: "二酸化炭素", episode: "二酸化炭素は炭酸飲料の泡やドライアイスに使われます。" },
    { question: "NH₃ はどれ？", choices: ["アンモニア", "酸素", "二酸化炭素", "水"], answer: "アンモニア", episode: "アンモニアは冷媒や洗剤など、工業でも重要です。" },
    { question: "H₂ + O でできる化合物はどれ？", choices: ["H₂O", "CO₂", "NH₃", "NaCl"], answer: "H₂O", episode: "水は2つの水素原子と1つの酸素原子からできています。" },
    { question: "CH₄ はどれ？", choices: ["メタン", "硫酸", "硝酸", "炭酸カルシウム"], answer: "メタン", episode: "メタンは天然ガスの主成分で、燃料として使われます。" },
    { question: "H₂SO₄ はどれ？", choices: ["硫酸", "メタン", "硝酸", "炭酸カルシウム"], answer: "硫酸", episode: "硫酸は強い酸で、バッテリーや肥料に使われます。" },
    { question: "HNO₃ はどれ？", choices: ["硝酸", "硫酸", "メタン", "炭酸カルシウム"], answer: "硝酸", episode: "硝酸は肥料や爆薬の原料になります。" },
    { question: "CaCO₃ はどれ？", choices: ["炭酸カルシウム", "硝酸", "硫酸", "メタン"], answer: "炭酸カルシウム", episode: "炭酸カルシウムは石灰石や貝殻の主成分です。" },
    { question: "H₂S はどれ？", choices: ["硫化水素", "メタン", "硫酸", "硝酸"], answer: "硫化水素", episode: "硫化水素は腐った卵のような臭いがします。" },
    { question: "MgCO₃ はどれ？", choices: ["マグネサイト", "オリビン", "輝石", "黄鉄鉱"], answer: "マグネサイト", episode: "マグネサイトはマグネシウムの鉱石として使われます。" },
    { question: "CaMgSi₂O₆ はどれ？", choices: ["輝石", "オリビン", "黄鉄鉱", "石英"], answer: "輝石", episode: "輝石は火成岩に含まれる鉱物です。" },
    { question: "(Mg,Fe)₂SiO₄ はどれ？", choices: ["オリビン", "輝石", "石英", "黄鉄鉱"], answer: "オリビン", episode: "オリビンは地球のマントルに多く含まれます。" },
    { question: "Fe₂O₃ はどれ？", choices: ["酸化鉄（赤鉄鉱）", "酸化アルミニウム", "硫化亜鉛", "炭化ケイ素"], answer: "酸化鉄（赤鉄鉱）", episode: "赤鉄鉱は赤色の鉄鉱石で、鉄の原料です。" },
    { question: "Al₂O₃ はどれ？", choices: ["酸化アルミニウム（コランダム）", "酸化鉄", "炭化ケイ素", "硫化亜鉛"], answer: "酸化アルミニウム（コランダム）", episode: "コランダムはルビーやサファイアの主成分です。" },
    { question: "SiC はどれ？", choices: ["炭化ケイ素", "酸化鉄", "酸化アルミニウム", "硫化亜鉛"], answer: "炭化ケイ素", episode: "炭化ケイ素は硬い素材で、研磨剤や切削工具に使われます。" },
    { question: "KNO₃ はどれ？", choices: ["硝酸カリウム", "硫酸銅", "炭酸ナトリウム", "硫化亜鉛"], answer: "硝酸カリウム", episode: "硝酸カリウムは火薬や肥料に使われます。" },
    { question: "NaHCO₃ はどれ？", choices: ["炭酸水素ナトリウム（重曹）", "硝酸カリウム", "硫酸銅", "硫化亜鉛"], answer: "炭酸水素ナトリウム（重曹）", episode: "重曹はお菓子作りや掃除に使われます。" },
    { question: "CaSO₄ はどれ？", choices: ["硫酸カルシウム（石膏）", "炭酸ナトリウム", "硫酸銅", "硫化亜鉛"], answer: "硫酸カルシウム（石膏）", episode: "石膏は建材や医療用ギプスに使われます。" },
    { question: "CuSO₄ はどれ？", choices: ["硫酸銅", "硫酸カルシウム", "炭酸ナトリウム", "硫化亜鉛"], answer: "硫酸銅", episode: "硫酸銅は農薬や実験用薬品として使われます。" },
    { question: "ZnS はどれ？", choices: ["硫化亜鉛", "硫酸銅", "硫酸カルシウム", "炭酸ナトリウム"], answer: "硫化亜鉛", episode: "硫化亜鉛は蛍光塗料や蛍光体に使われます。" },
    { question: "PbS はどれ？", choices: ["硫化鉛（方鉛鉱）", "硫化亜鉛", "硫酸銅", "硫酸カルシウム"], answer: "硫化鉛（方鉛鉱）", episode: "方鉛鉱は鉛の主な鉱石です。" },
    { question: "Na₂CO₃ はどれ？", choices: ["炭酸ナトリウム（ソーダ灰）", "硫酸カルシウム", "硫酸銅", "硫化亜鉛"], answer: "炭酸ナトリウム（ソーダ灰）", episode: "ソーダ灰はガラスや石けんの製造に使われます。" },
    { question: "CO はどれ？", choices: ["一酸化炭素", "二酸化炭素", "酸素", "窒素"], answer: "一酸化炭素", episode: "一酸化炭素は無色・無臭で、毒性があります。" },
    { question: "塩化アンモニウムの化学式はどれ？", choices: ["NH₄Cl", "NaCl", "KCl", "NH₃"], answer: "NH₄Cl", episode: "塩化アンモニウムは電池や医薬品に使われます。" },
{ question: "KCl はどれ？", choices: ["塩化カリウム", "塩化ナトリウム", "硫酸カリウム", "塩化カルシウム"], answer: "塩化カリウム", episode: "塩化カリウムは肥料として使われます。" },
{ question: "CaCl₂ はどれ？", choices: ["塩化カルシウム", "塩化ナトリウム", "塩化カリウム", "塩化マグネシウム"], answer: "塩化カルシウム", episode: "塩化カルシウムは凍結防止剤として道路にまかれます。" },
{ question: "MgCl₂ はどれ？", choices: ["塩化マグネシウム", "塩化カルシウム", "塩化ナトリウム", "塩化カリウム"], answer: "塩化マグネシウム", episode: "塩化マグネシウムはにがりの成分として使われます。" },
{ question: "C はどれ？", choices: ["炭素", "酸素", "水素", "窒素"], answer: "炭素", episode: "炭素はダイヤモンドや石炭の主成分です。" },
{ question: "N₂ はどれ？", choices: ["窒素", "酸素", "二酸化炭素", "水"], answer: "窒素", episode: "窒素は空気の約78%を占める気体です。" },
{ question: "P はどれ？", choices: ["リン", "硫黄", "炭素", "窒素"], answer: "リン", episode: "リンはマッチの発火部などに使われます。" },
{ question: "S はどれ？", choices: ["硫黄", "リン", "炭素", "窒素"], answer: "硫黄", episode: "硫黄は温泉の成分や火山地帯で見られます。" },
{ question: "HCl はどれ？", choices: ["塩酸", "硫酸", "硝酸", "酢酸"], answer: "塩酸", episode: "塩酸は胃液の成分でもあり、金属を溶かします。" },
{ question: "CH₃COOH はどれ？", choices: ["酢酸", "塩酸", "硝酸", "硫酸"], answer: "酢酸", episode: "酢酸はお酢の成分で酸っぱい味を持ちます。" },
{ question: "NH₄NO₃ はどれ？", choices: ["硝酸アンモニウム", "硫酸アンモニウム", "塩化アンモニウム", "硝酸ナトリウム"], answer: "硝酸アンモニウム", episode: "硝酸アンモニウムは肥料や爆薬の材料になります。" },
{ question: "Na₂SO₄ はどれ？", choices: ["硫酸ナトリウム", "硝酸ナトリウム", "炭酸ナトリウム", "塩化ナトリウム"], answer: "硫酸ナトリウム", episode: "硫酸ナトリウムはガラス製造や洗剤に使われます。" },
{ question: "NaNO₃ はどれ？", choices: ["硝酸ナトリウム", "硫酸ナトリウム", "炭酸ナトリウム", "塩化ナトリウム"], answer: "硝酸ナトリウム", episode: "硝酸ナトリウムは肥料や火薬の原料です。" },
{ question: "ZnO はどれ？", choices: ["酸化亜鉛", "酸化鉄", "酸化アルミニウム", "酸化マグネシウム"], answer: "酸化亜鉛", episode: "酸化亜鉛は日焼け止めや塗料に使われます。" },
{ question: "BaSO₄ はどれ？", choices: ["硫酸バリウム", "硫酸ナトリウム", "硫酸カルシウム", "硫酸銅"], answer: "硫酸バリウム", episode: "硫酸バリウムはX線検査でバリウムとして使われます。" },
{ question: "AgCl はどれ？", choices: ["塩化銀", "塩化ナトリウム", "塩化カリウム", "塩化マグネシウム"], answer: "塩化銀", episode: "塩化銀は感光性があり、写真フィルムに使われます。" },
{ question: "CuCl₂ はどれ？", choices: ["塩化銅", "硫酸銅", "硝酸銅", "塩化鉄"], answer: "塩化銅", episode: "塩化銅は青緑色で、実験や染料に使われます。" },
{ question: "FeCl₃ はどれ？", choices: ["塩化鉄", "塩化銅", "硫酸鉄", "硝酸鉄"], answer: "塩化鉄", episode: "塩化鉄は水処理や写真現像に使われます。" },
{ question: "TiO₂ はどれ？", choices: ["酸化チタン", "酸化鉄", "酸化銅", "酸化マグネシウム"], answer: "酸化チタン", episode: "酸化チタンは白色顔料や日焼け止めに使われます。" },
{ question: "Cr₂O₃ はどれ？", choices: ["酸化クロム", "酸化鉄", "酸化銅", "酸化マグネシウム"], answer: "酸化クロム", episode: "酸化クロムは緑色顔料として塗料に使われます。" },
{ question: "MnO₂ はどれ？", choices: ["酸化マンガン", "酸化鉄", "酸化銅", "酸化亜鉛"], answer: "酸化マンガン", episode: "酸化マンガンは乾電池の材料として使われます。" }
];

const extraQuizData = [
    { question: "ダイヤモンドの結晶構造は？", choices: ["共有結合結晶", "金属結晶", "イオン結晶", "分子結晶"], answer: "共有結合結晶", episode: "ダイヤモンドは炭素原子が強固に共有結合した結晶です。" },
    { question: "黄鉄鉱の主成分は？", choices: ["FeS₂", "Fe₂O₃", "Fe₃O₄", "FeO"], answer: "FeS₂", episode: "黄鉄鉱は“愚者の金”と呼ばれ、FeS₂で構成されています。" },
    { question: "石英の主成分は？", choices: ["SiO₂", "Al₂O₃", "CaCO₃", "MgCO₃"], answer: "SiO₂", episode: "石英は二酸化ケイ素でできた鉱物です。" },
    { question: "ルビーとサファイアの主成分は？", choices: ["Al₂O₃", "SiO₂", "Fe₂O₃", "MgCO₃"], answer: "Al₂O₃", episode: "コランダムの仲間で、不純物によって色が変わります。" },
    { question: "カルサイトの主成分は？", choices: ["CaCO₃", "CaSO₄", "CaCl₂", "CaF₂"], answer: "CaCO₃", episode: "カルサイトは炭酸カルシウムの結晶で、石灰岩を構成します。" },
    { question: "黄銅鉱の主成分は？", choices: ["CuFeS₂", "Cu₂S", "CuS", "FeS₂"], answer: "CuFeS₂", episode: "黄銅鉱は銅の主要な鉱石です。" },
    { question: "方鉛鉱の主成分は？", choices: ["PbS", "ZnS", "FeS₂", "CuS"], answer: "PbS", episode: "方鉛鉱は鉛の主要な鉱石で、銀も伴います。" },
    { question: "輝銀鉱の主成分は？", choices: ["Ag₂S", "AgCl", "AgBr", "AgI"], answer: "Ag₂S", episode: "輝銀鉱は銀を含む代表的な鉱物です。" },
    { question: "オパールの化学式は？", choices: ["SiO₂・nH₂O", "Al₂O₃", "CaCO₃", "Fe₂O₃"], answer: "SiO₂・nH₂O", episode: "オパールは二酸化ケイ素に水が含まれた鉱物で、美しい遊色効果があります。" },
    { question: "ビスマスの化学式は？", choices: ["Bi", "Ba", "Be", "B"], answer: "Bi", episode: "ビスマスは虹色の酸化皮膜が特徴で、金属元素の一つです。" },
    { question: "エメラルドの主成分は？", choices: ["ベリル", "コランダム", "石英", "方解石"], answer: "ベリル", episode: "エメラルドはベリル（Be₃Al₂Si₆O₁₈）にクロムが混じったものです。" },
    { question: "ガーネットは何の鉱物グループ？", choices: ["珪酸塩鉱物", "硫化鉱物", "酸化鉱物", "炭酸塩鉱物"], answer: "珪酸塩鉱物", episode: "ガーネットは複雑な珪酸塩鉱物グループに属します。" },
    { question: "スピネルの主成分は？", choices: ["MgAl₂O₄", "Al₂O₃", "Fe₃O₄", "SiO₂"], answer: "MgAl₂O₄", episode: "スピネルはマグネシウムとアルミニウムの酸化物です。" },
    { question: "ペリドットの主成分は？", choices: ["オリビン", "スピネル", "石英", "長石"], answer: "オリビン", episode: "ペリドットはオリビンの宝石質のものです。" },
    { question: "トパーズの主成分は？", choices: ["Al₂SiO₄(F,OH)₂", "SiO₂", "Al₂O₃", "MgCO₃"], answer: "Al₂SiO₄(F,OH)₂", episode: "トパーズは含フッ素アルミノ珪酸塩鉱物です。" },
    { question: "蛍石の化学式は？", choices: ["CaF₂", "CaCO₃", "CaSO₄", "CaCl₂"], answer: "CaF₂", episode: "蛍石は蛍光を示すことからこの名がつきます。" },
    { question: "長石の主成分は？", choices: ["アルカリアルミノ珪酸塩", "炭酸カルシウム", "酸化鉄", "硫化鉛"], answer: "アルカリアルミノ珪酸塩", episode: "長石は地殻中で最も多い珪酸塩鉱物です。" },
    { question: "マグネサイトの化学式は？", choices: ["MgCO₃", "CaCO₃", "FeCO₃", "MnCO₃"], answer: "MgCO₃", episode: "マグネサイトはマグネシウム鉱石として利用されます。" },
    { question: "赤鉄鉱の化学式は？", choices: ["Fe₂O₃", "Fe₃O₄", "FeO", "FeS₂"], answer: "Fe₂O₃", episode: "赤鉄鉱は鉄の重要な鉱石です。" }
];
