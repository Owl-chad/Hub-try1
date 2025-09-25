
export interface AnalysisQuestion {
    id: string;
    text: string;
}

export interface AnalysisLevel {
    title: string;
    questions: AnalysisQuestion[];
}

export interface AnalysisSection {
    title: string;
    levels: AnalysisLevel[];
}

export const ANALYSIS_FRAMEWORK: AnalysisSection[] = [
    {
        title: '總環境分析',
        levels: [
            {
                title: '第1層面.經濟層面的分析',
                questions: [
                    { id: 's0-l0-q0', text: '國家經濟景氣情況的前景如何?' },
                    { id: 's0-l0-q1', text: '其他"行銷市場"的經濟景氣情況如何?' },
                    { id: 's0-l0-q2', text: '國家的國際收支情況如何?對該國的貨幣幣值可能有怎樣的影響?' },
                    { id: 's0-l0-q3', text: '經濟發展的動向以及有關經濟的大事，可能如何影響這個project的策略，或是本團隊的策略?' },
                ]
            },
            {
                title: '第二層面政治層面的分析',
                questions: [
                    { id: 's0-l1-q0', text: '政府的政策或管制措施，可能有什麼變動?' },
                    { id: 's0-l1-q1', text: '政府的政策或管制措施的變動，可能發生甚麼影響?' },
                    { id: 's0-l1-q2', text: '政府正在研議的租稅措施、及其他激勵輔導措施，有什麼項目可能影響策略?' },
                    { id: 's0-l1-q3', text: '在某一個國家的競品企業可能面臨什麼樣的政治局面?' },
                ]
            },
            {
                title: '第三層面科技層面的分析',
                questions: [
                    { id: 's0-l2-q0', text: '目前應用的科技，限以成熟到什麼程度?' },
                    { id: 's0-l2-q1', text: '現有什麼新科技與此相關正在開發之中?' },
                    { id: 's0-l2-q2', text: '科技上是否有可能有突破性的進展?' },
                    { id: 's0-l2-q3', text: '可能出現怎麼樣的突破?' },
                    { id: 's0-l2-q4', text: '有了突破進展，多快便可以發生衝擊?' },
                    { id: 's0-l2-q5', text: '該項突破的科技，對其他科技及對市場可能有什麼影響?' },
                ]
            },
            {
                title: '第四層面文化層面的分析',
                questions: [
                    { id: 's0-l3-q0', text: '國民的生活方式、風氣、及其他文化因素等等，以及未來的可能變化如何?' },
                    { id: 's0-l3-q1', text: '為甚麼會有變化?有什麼促成變化可能的原因?' },
                    { id: 's0-l3-q2', text: '文化的變動對競品企業可能有些什麼影響?' },
                ]
            },
            {
                title: '第五層面人口層面的分析',
                questions: [
                    { id: 's0-l4-q0', text: '人口變動得趨向，對產業的市場規模可能有些什麼影響?' },
                    { id: 's0-l4-q1', text: '有些什麼人口變動的趨向，可能會成為產業的機會?可能會成為產業的威脅?' },
                ]
            }
        ]
    },
    {
        title: '產業環境分析',
        levels: [
            {
                title: '第一層面產業的競爭強度',
                questions: [
                    { id: 's1-l0-q0', text: '現有競爭對手的性質與家數；供應商與顧客的談判力；替代品與潛在的新進競爭者所形成的威脅' },
                ]
            },
            {
                title: '第二層面市場狀況分析',
                questions: [
                    { id: 's1-l1-q0', text: '實際產業市場規模與潛在市場規模的分析:潛在市場包括"使用差距"，及增加使用頻次、使用方法及新的使用人與用途後尚能滲透之市場' },
                    { id: 's1-l1-q1', text: '產業市場過去的發展狀況及其成長分析' },
                    { id: 's1-l1-q2', text: '市場的成熟度、市場之區隔與選擇等分析' },
                    { id: 's1-l1-q3', text: '產業市場變動的趨勢分析與未來成長潛力' },
                ]
            },
            {
                title: '第三層面是生產狀況分析',
                questions: [
                    { id: 's1-l2-q0', text: '成本結構分析:將生產過程分解成若干階段，分析各階段的附加價值及價值如何變動，判斷是否適用經驗曲線策略' },
                    { id: 's1-l2-q1', text: '生產方法與技術分析:分析現況與探討未來可能改變的生產模式或生產技術，以降低成本、提高品質或增進速度的效益。' },
                ]
            },
            {
                title: '第四層面產品狀況分析',
                questions: [
                    { id: 's1-l3-q0', text: '產品線的廣度與特色分析' },
                    { id: 's1-l3-q1', text: '產品生命週期分析' },
                    { id: 's1-l3-q2', text: '未來的新產品發展構想與策略' },
                    { id: 's1-l3-q3', text: '配銷體系與通路分析' },
                ]
            },
            {
                title: '第五層面競爭狀況分析',
                questions: [
                    { id: 's1-l4-q0', text: '競爭對手的優勢與弱點' },
                    { id: 's1-l4-q1', text: '競爭對手的目標與假設' },
                    { id: 's1-l4-q2', text: '競爭對手的規模、成長與獲利力' },
                    { id: 's1-l4-q3', text: '競爭對手的成本結構及退出障礙' },
                    { id: 's1-l4-q4', text: '競爭對手的限再策略及過去策略' },
                    { id: 's1-l4-q5', text: '競爭對手的組織與文化' },
                ]
            },
        ]
    },
    {
        title: '競爭環境分析',
        levels: [
            {
                title: '第一層面產業內現有的競爭對手分析',
                questions: [{ id: 's2-l0-q0', text: '分析產業內現有的競爭對手' }]
            },
            {
                title: '第二層面供應商的談判力分析',
                questions: [{ id: 's2-l1-q0', text: '分析供應商的談判力' }]
            },
            {
                title: '第三層面顧客的談判力分析',
                questions: [{ id: 's2-l2-q0', text: '分析顧客的談判力' }]
            },
            {
                title: '第四層面替代品的威脅分析',
                questions: [{ id: 's2-l3-q0', text: '分析替代品的威脅' }]
            },
            {
                title: '第五層面潛在的新進競爭者的威脅分析',
                questions: [{ id: 's2-l4-q0', text: '分析潛在的新進競爭者 (可使用 Michael E. Porter 的五力分析)' }]
            },
        ]
    },
    {
        title: '顧客環境分析',
        levels: [
            {
                title: '第一層面是市場區隔化分支分析',
                questions: [
                    { id: 's3-l0-q0', text: '本產品的購買人及使用者是誰?' },
                    { id: 's3-l0-q1', text: '最大的購買者是誰?' },
                    { id: 's3-l0-q2', text: '現在尚未購買，但可認定其為潛在的顧客有些什麼人?' },
                    { id: 's3-l0-q3', text: '市場的劃分區隔變數如何設定?' },
                    { id: 's3-l0-q4', text: '市場的區隔如何選擇?' },
                ]
            },
            {
                title: '第二層面顧客購買動機之分析',
                questions: [
                    { id: 's3-l1-q0', text: '顧客因為什麼動機，才購買及使用本項產品或服務?' },
                    { id: 's3-l1-q1', text: '本項產品或服務，其真正重要的特性是什麼?(產品的核心屬性)' },
                    { id: 's3-l1-q2', text: '客戶追求的目標與價值是什麼?' },
                    { id: 's3-l1-q3', text: '顧客的購買動機，現在出現了什麼變化?或是將來可能出現什麼變化?' },
                ]
            },
            {
                title: '第三層面是顧客尚未滿足之需求分析',
                questions: [
                    { id: 's3-l2-q0', text: '顧客對於現在購買的產品或服務，是否已經獲得滿足?' },
                    { id: 's3-l2-q1', text: '顧客是否感到任何困擾?' },
                    { id: 's3-l2-q2', text: '顧客是否有尚未滿足的需要，而顧客本身也許尚不知道?' },
                ]
            }
        ]
    }
];

export const TOTAL_QUESTIONS = ANALYSIS_FRAMEWORK.reduce((total, section) => 
    total + section.levels.reduce((subTotal, level) => subTotal + level.questions.length, 0), 0);
