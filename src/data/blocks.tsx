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
];
