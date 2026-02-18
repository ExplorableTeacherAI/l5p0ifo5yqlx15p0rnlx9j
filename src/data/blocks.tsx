import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { FullWidthLayout, SplitLayout } from "@/components/layouts";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors, useVar } from "@/stores";
import { getDefaultValues, variableDefinitions, getVariableInfo, numberPropsFromDefinition } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import editable components
import {
    EditableH1,
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineTooltip,
    InlineFormula,
    InlineSpotColor,
} from "@/components/atoms";

// ============================================================================
// HELPER FUNCTIONS FOR MATH OPERATIONS
// ============================================================================

/** Get all factors of a number */
function getFactors(n: number): number[] {
    const factors: number[] = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) factors.push(i);
    }
    return factors;
}

/** Get factor pairs of a number */
function getFactorPairs(n: number): [number, number][] {
    const pairs: [number, number][] = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            pairs.push([i, n / i]);
        }
    }
    return pairs;
}

// ============================================================================
// REACTIVE VISUAL COMPONENTS
// ============================================================================

/** Visual display of factors for a number */
function FactorsDisplay() {
    const num = useVar('factorNumber', 12) as number;
    const factors = getFactors(num);
    const pairs = getFactorPairs(num);

    return (
        <div className="p-6 bg-card rounded-xl border border-border">
            <div className="text-center mb-4">
                <div className="text-lg font-semibold text-foreground mb-2">
                    Factors of <span className="text-[#3B82F6] font-bold text-2xl">{num}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {factors.map((f) => (
                        <span
                            key={f}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm"
                        >
                            {f}
                        </span>
                    ))}
                </div>
            </div>

            <div className="border-t border-border pt-4">
                <div className="text-sm font-medium text-muted-foreground mb-3 text-center">
                    Factor Pairs (numbers that multiply to give {num})
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {pairs.map(([a, b], idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                        >
                            <span className="font-bold text-blue-600">{a}</span>
                            <span className="text-gray-400">×</span>
                            <span className="font-bold text-indigo-600">{b}</span>
                            <span className="text-gray-400">=</span>
                            <span className="font-bold text-gray-700">{num}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                {num} has <span className="font-bold text-foreground">{factors.length}</span> factors
            </div>
        </div>
    );
}

/** Get multiples of a number */
function getMultiples(base: number, count: number): number[] {
    const multiples: number[] = [];
    for (let i = 1; i <= count; i++) {
        multiples.push(base * i);
    }
    return multiples;
}

/** Get common factors of two numbers */
function getCommonFactors(a: number, b: number): number[] {
    const factorsA = getFactors(a);
    const factorsB = getFactors(b);
    return factorsA.filter(f => factorsB.includes(f));
}

/** Get HCF of two numbers */
function getHCF(a: number, b: number): number {
    const common = getCommonFactors(a, b);
    return Math.max(...common);
}

/** Visual number line showing multiples */
function MultiplesNumberLine() {
    const base = useVar('multipleBase', 4) as number;
    const count = useVar('multipleCount', 6) as number;
    const multiples = getMultiples(base, count);
    const maxValue = base * count;

    return (
        <div className="p-6 bg-card rounded-xl border border-border">
            <div className="text-center mb-4">
                <div className="text-lg font-semibold text-foreground mb-1">
                    Multiples of <span className="text-[#10B981] font-bold text-2xl">{base}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    (First {count} multiples)
                </div>
            </div>

            {/* Number line visualization */}
            <div className="relative mt-6 mb-8">
                {/* The line */}
                <div className="h-1 bg-gray-200 rounded-full relative">
                    {/* Markers for each multiple */}
                    {multiples.map((m, idx) => {
                        const position = ((idx + 1) / count) * 100;
                        return (
                            <div
                                key={m}
                                className="absolute transform -translate-x-1/2"
                                style={{ left: `${position}%`, top: '-8px' }}
                            >
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-emerald-600">
                                    {m}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Multiples as equation */}
            <div className="mt-8 space-y-2">
                <div className="text-sm font-medium text-muted-foreground text-center mb-3">
                    How we get each multiple:
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {multiples.map((m, idx) => (
                        <div
                            key={m}
                            className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-lg text-sm"
                        >
                            <span className="text-emerald-600 font-semibold">{base}</span>
                            <span className="text-gray-400">×</span>
                            <span className="text-purple-600 font-semibold">{idx + 1}</span>
                            <span className="text-gray-400">=</span>
                            <span className="text-emerald-700 font-bold">{m}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Venn diagram visualization for HCF */
function HCFVennDiagram() {
    const numA = useVar('hcfNumberA', 12) as number;
    const numB = useVar('hcfNumberB', 18) as number;

    const factorsA = getFactors(numA);
    const factorsB = getFactors(numB);
    const commonFactors = getCommonFactors(numA, numB);
    const hcf = getHCF(numA, numB);

    const onlyA = factorsA.filter(f => !commonFactors.includes(f));
    const onlyB = factorsB.filter(f => !commonFactors.includes(f));

    return (
        <div className="p-6 bg-card rounded-xl border border-border">
            <div className="text-center mb-4">
                <div className="text-lg font-semibold text-foreground">
                    Finding HCF of{" "}
                    <span className="text-[#EF4444] font-bold">{numA}</span>
                    {" "}and{" "}
                    <span className="text-[#F97316] font-bold">{numB}</span>
                </div>
            </div>

            {/* Venn Diagram Style */}
            <div className="flex justify-center items-center gap-0 my-6">
                {/* Left circle - factors only in A */}
                <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center">
                        <div className="text-center pr-8">
                            <div className="text-xs text-red-600 font-semibold mb-1">Only in {numA}</div>
                            <div className="flex flex-wrap justify-center gap-1">
                                {onlyA.map(f => (
                                    <span key={f} className="px-2 py-0.5 bg-red-200 text-red-700 rounded text-sm font-medium">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlap - common factors */}
                <div className="relative -ml-16 z-10">
                    <div className="w-32 h-40 bg-gradient-to-r from-red-100 via-amber-100 to-orange-100 rounded-full flex items-center justify-center border-y-2 border-amber-300">
                        <div className="text-center">
                            <div className="text-xs text-amber-700 font-semibold mb-1">Common</div>
                            <div className="flex flex-wrap justify-center gap-1">
                                {commonFactors.map(f => (
                                    <span
                                        key={f}
                                        className={`px-2 py-0.5 rounded text-sm font-medium ${
                                            f === hcf
                                                ? 'bg-amber-400 text-amber-900 ring-2 ring-amber-500'
                                                : 'bg-amber-200 text-amber-700'
                                        }`}
                                    >
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right circle - factors only in B */}
                <div className="relative -ml-16">
                    <div className="w-40 h-40 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center">
                        <div className="text-center pl-8">
                            <div className="text-xs text-orange-600 font-semibold mb-1">Only in {numB}</div>
                            <div className="flex flex-wrap justify-center gap-1">
                                {onlyB.map(f => (
                                    <span key={f} className="px-2 py-0.5 bg-orange-200 text-orange-700 rounded text-sm font-medium">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result */}
            <div className="mt-6 text-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <div className="text-sm text-muted-foreground mb-1">
                    The <strong>Highest Common Factor</strong> is the largest number in the overlap:
                </div>
                <div className="text-3xl font-bold text-amber-600">
                    HCF({numA}, {numB}) = {hcf}
                </div>
            </div>
        </div>
    );
}

/**
 * ------------------------------------------------------------------
 * HCF & LCM LESSON
 * ------------------------------------------------------------------
 * An interactive lesson teaching Highest Common Factors and
 * Lowest Common Multiples to Lower Secondary students.
 */

export const blocks: ReactElement[] = [
    // ========================================
    // LESSON TITLE
    // ========================================
    <FullWidthLayout key="layout-title" maxWidth="xl">
        <Block id="block-title" padding="lg">
            <EditableH1 id="h1-lesson-title" blockId="block-title">
                Highest Common Factors & Lowest Common Multiples
            </EditableH1>
            <EditableParagraph id="para-lesson-intro" blockId="block-title">
                Welcome! In this lesson, you'll discover how numbers are connected through
                factors and multiples. These concepts help us solve real-world problems —
                from sharing items equally to scheduling events. Let's begin by exploring
                what factors are.
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,

    // ========================================
    // SECTION 1: WHAT ARE FACTORS?
    // ========================================
    <FullWidthLayout key="layout-section1-title" maxWidth="xl">
        <Block id="block-section1-title" padding="md">
            <EditableH2 id="h2-factors-title" blockId="block-section1-title">
                Section 1: What are Factors?
            </EditableH2>
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-factors-definition" maxWidth="xl">
        <Block id="block-factors-definition" padding="sm">
            <EditableParagraph id="para-factors-def" blockId="block-factors-definition">
                A{" "}
                <InlineTooltip id="tooltip-factor" tooltip="A factor is a whole number that divides another number exactly, with no remainder.">
                    factor
                </InlineTooltip>
                {" "}of a number is a whole number that divides it exactly with no remainder.
                For example, 3 is a factor of 12 because 12 ÷ 3 = 4 (no remainder).
                But 5 is not a factor of 12 because 12 ÷ 5 = 2 remainder 2.
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-factors-interactive" maxWidth="xl">
        <Block id="block-factors-interactive" padding="sm">
            <EditableParagraph id="para-factors-explore" blockId="block-factors-interactive">
                Let's explore! Change the number below to see its factors. Try setting it to{" "}
                <InlineScrubbleNumber
                    id="scrubble-factor-number"
                    varName="factorNumber"
                    {...numberPropsFromDefinition(getVariableInfo('factorNumber'))}
                />
                {" "}and watch how the factors change. Notice that 1 and the number itself are always factors!
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-factors-visual" maxWidth="xl">
        <Block id="block-factors-visual" padding="sm">
            <FactorsDisplay />
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-factors-key-point" maxWidth="xl">
        <Block id="block-factors-key-point" padding="sm">
            <EditableParagraph id="para-factors-keypoint" blockId="block-factors-key-point">
                <strong>Key Point:</strong> Factors always come in pairs that multiply to give the original number.
                We write this as{" "}
                <InlineFormula
                    id="formula-factor-pair"
                    latex="\clr{a}{a} \times \clr{b}{b} = \clr{n}{n}"
                    colorMap={{ a: '#3B82F6', b: '#6366F1', n: '#1F2937' }}
                />
                {" "}where both{" "}
                <InlineFormula id="formula-a" latex="\clr{a}{a}" colorMap={{ a: '#3B82F6' }} />
                {" "}and{" "}
                <InlineFormula id="formula-b" latex="\clr{b}{b}" colorMap={{ b: '#6366F1' }} />
                {" "}are factors of{" "}
                <InlineFormula id="formula-n" latex="\clr{n}{n}" colorMap={{ n: '#1F2937' }} />
                .
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,

    // ========================================
    // SECTION 2: WHAT ARE MULTIPLES?
    // ========================================
    <FullWidthLayout key="layout-section2-title" maxWidth="xl">
        <Block id="block-section2-title" padding="md">
            <EditableH2 id="h2-multiples-title" blockId="block-section2-title">
                Section 2: What are Multiples?
            </EditableH2>
        </Block>
    </FullWidthLayout>,

    <SplitLayout key="layout-multiples-content" ratio="1:1" gap="lg">
        <Block id="block-multiples-explanation" padding="sm">
            <EditableParagraph id="para-multiples-def" blockId="block-multiples-explanation">
                A{" "}
                <InlineTooltip id="tooltip-multiple" tooltip="A multiple of a number is the result of multiplying that number by a whole number (1, 2, 3, ...).">
                    multiple
                </InlineTooltip>
                {" "}is what you get when you multiply a number by 1, 2, 3, and so on.
                Think of it as "skip counting" — the multiples of 3 are 3, 6, 9, 12, 15...
            </EditableParagraph>
            <EditableParagraph id="para-multiples-interactive" blockId="block-multiples-explanation">
                Try changing the base number to{" "}
                <InlineScrubbleNumber
                    id="scrubble-multiple-base"
                    varName="multipleBase"
                    {...numberPropsFromDefinition(getVariableInfo('multipleBase'))}
                />
                {" "}and see its first{" "}
                <InlineScrubbleNumber
                    id="scrubble-multiple-count"
                    varName="multipleCount"
                    {...numberPropsFromDefinition(getVariableInfo('multipleCount'))}
                />
                {" "}multiples on the number line!
            </EditableParagraph>
            <EditableParagraph id="para-multiples-formula" blockId="block-multiples-explanation">
                We can write the multiples of a number{" "}
                <InlineFormula id="formula-n-mult" latex="\clr{n}{n}" colorMap={{ n: '#10B981' }} />
                {" "}as:{" "}
                <InlineFormula
                    id="formula-multiples"
                    latex="\clr{n}{n} \times 1, \clr{n}{n} \times 2, \clr{n}{n} \times 3, ..."
                    colorMap={{ n: '#10B981' }}
                />
            </EditableParagraph>
        </Block>
        <Block id="block-multiples-visual" padding="sm">
            <MultiplesNumberLine />
        </Block>
    </SplitLayout>,

    <FullWidthLayout key="layout-multiples-comparison" maxWidth="xl">
        <Block id="block-multiples-comparison" padding="sm">
            <EditableParagraph id="para-factors-vs-multiples" blockId="block-multiples-comparison">
                <strong>Factors vs Multiples:</strong> Notice the difference! Factors of 12 are smaller numbers
                that divide into 12 (like 1, 2, 3, 4, 6, 12). But multiples of 12 are larger numbers
                that 12 divides into (like 12, 24, 36, 48...). Factors go down, multiples go up!
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,

    // ========================================
    // SECTION 3: HIGHEST COMMON FACTOR (HCF)
    // ========================================
    <FullWidthLayout key="layout-section3-title" maxWidth="xl">
        <Block id="block-section3-title" padding="md">
            <EditableH2 id="h2-hcf-title" blockId="block-section3-title">
                Section 3: Finding the Highest Common Factor (HCF)
            </EditableH2>
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-hcf-definition" maxWidth="xl">
        <Block id="block-hcf-definition" padding="sm">
            <EditableParagraph id="para-hcf-def" blockId="block-hcf-definition">
                Now that we understand factors, let's find factors that two numbers share!
                The{" "}
                <InlineTooltip id="tooltip-hcf" tooltip="The Highest Common Factor (HCF) is the largest number that divides exactly into two or more numbers.">
                    Highest Common Factor (HCF)
                </InlineTooltip>
                {" "}is the biggest factor that two numbers have in common. It's also called the
                Greatest Common Divisor (GCD).
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-hcf-interactive" maxWidth="xl">
        <Block id="block-hcf-interactive" padding="sm">
            <EditableParagraph id="para-hcf-explore" blockId="block-hcf-interactive">
                Let's find the HCF of two numbers. Change the first number to{" "}
                <InlineScrubbleNumber
                    id="scrubble-hcf-a"
                    varName="hcfNumberA"
                    {...numberPropsFromDefinition(getVariableInfo('hcfNumberA'))}
                />
                {" "}and the second number to{" "}
                <InlineScrubbleNumber
                    id="scrubble-hcf-b"
                    varName="hcfNumberB"
                    {...numberPropsFromDefinition(getVariableInfo('hcfNumberB'))}
                />
                . Watch the Venn diagram below to see which factors they share!
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-hcf-visual" maxWidth="xl">
        <Block id="block-hcf-visual" padding="sm">
            <HCFVennDiagram />
        </Block>
    </FullWidthLayout>,

    <FullWidthLayout key="layout-hcf-steps" maxWidth="xl">
        <Block id="block-hcf-steps" padding="sm">
            <EditableH3 id="h3-hcf-steps" blockId="block-hcf-steps">
                How to Find the HCF
            </EditableH3>
            <EditableParagraph id="para-hcf-step1" blockId="block-hcf-steps">
                <strong>Step 1:</strong> List all the factors of the first number.
            </EditableParagraph>
            <EditableParagraph id="para-hcf-step2" blockId="block-hcf-steps">
                <strong>Step 2:</strong> List all the factors of the second number.
            </EditableParagraph>
            <EditableParagraph id="para-hcf-step3" blockId="block-hcf-steps">
                <strong>Step 3:</strong> Find the factors that appear in both lists (the common factors).
            </EditableParagraph>
            <EditableParagraph id="para-hcf-step4" blockId="block-hcf-steps">
                <strong>Step 4:</strong> The HCF is the largest of these common factors!
            </EditableParagraph>
        </Block>
    </FullWidthLayout>,
];
