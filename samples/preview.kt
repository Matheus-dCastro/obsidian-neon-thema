package com.obsidian.neon.kotlin

/**
 * =============================================================================
 * Obsidian Neon (Dracula Syntax) - Kotlin Showcase
 * =============================================================================
 * Demonstrates:
 *   - KDoc cursive comments and structured annotations
 *   - Data classes, Value classes, Sealed interfaces & Smart Casts
 *   - Extension functions, Operator overloading & Infix notations
 *   - Sequence DSL pipelines, Inline & Reified Generics
 *   - Null-safety (?.), Elvis operator (?:) & When expressions
 */

// --- Value Class & Data Classes ---
@JvmInline
value class HexColor(val raw: String) {
    init {
        require(raw.startsWith("#")) { "Hex color must start with '#'" }
    }
}

data class NeonPalette(
    val name: String,
    val background: HexColor = HexColor("#191525"),
    val foreground: HexColor = HexColor("#E1E1E6"),
    val pink: HexColor = HexColor("#FF79C6"),
    val green: HexColor = HexColor("#50FA7B"),
    val cyan: HexColor = HexColor("#8BE9FD"),
    val isDraculaSyntax: Boolean = true
)

// --- Sealed Hierarchy for AST Tokens ---
sealed interface SyntaxNode {
    val line: Int
    val column: Int

    data class Keyword(val text: String, override val line: Int, override val column: Int) : SyntaxNode
    data class FunctionCall(val name: String, val argCount: Int, override val line: Int, override val column: Int) : SyntaxNode
    data class StringLiteral(val content: String, override val line: Int, override val column: Int) : SyntaxNode
    data object EndOfFile : SyntaxNode {
        override val line: Int = -1
        override val column: Int = -1
    }
}

// --- Extension Functions & Operator Overloading ---
operator fun HexColor.plus(alphaPercentage: Int): String =
    "${this.raw}${alphaPercentage.coerceIn(0, 100).toString(16).padStart(2, '0')}"

infix fun String.highlightWith(color: HexColor): String =
    "\u001B[38;2;${color.raw}m$this\u001B[0m"

// --- Inline Function with Reified Type ---
inline fun <reified T : SyntaxNode> List<SyntaxNode>.filterNodeType(): List<T> =
    this.filterIsInstance<T>()

// --- Showcase Service & Sequence Processing ---
class ObsidianKotlinEngine(val palette: NeonPalette) {

    /**
     * Emits highlighting stream using Kotlin Sequence generator.
     */
    fun tokenSequence(nodes: List<SyntaxNode>): Sequence<String> = sequence {
        for (node in nodes) {
            val formatted = when (node) {
                is SyntaxNode.Keyword ->
                    "Keyword '${node.text}' -> ${palette.pink.raw} (italic cursive)"
                is SyntaxNode.FunctionCall ->
                    "Call '${node.name}()' with ${node.argCount} args -> ${palette.green.raw} (bold)"
                is SyntaxNode.StringLiteral ->
                    "Literal \"${node.content}\" -> #F1FA8C"
                SyntaxNode.EndOfFile ->
                    "EOF reached"
            }
            yield(formatted)
        }
    }

    fun renderPreview(): Int {
        val sampleNodes = listOf(
            SyntaxNode.Keyword("suspend", 1, 1),
            SyntaxNode.Keyword("fun", 1, 9),
            SyntaxNode.FunctionCall("applyNeonGlow", 2, 1, 13),
            SyntaxNode.StringLiteral("Obsidian Neon active", 1, 28),
            SyntaxNode.EndOfFile
        )

        val keywords = sampleNodes.filterNodeType<SyntaxNode.Keyword>()
        println("Found ${keywords.size} keyword tokens in scope.")

        tokenSequence(sampleNodes).forEach { log ->
            println("[Sequence] $log")
        }

        return keywords.size
    }
}

// --- Main Runner ---
fun main() {
    println("🔮 Launching Obsidian Neon Kotlin Showcase...")
    val palette = NeonPalette("Obsidian Neon Dracula")
    val engine = ObsidianKotlinEngine(palette)

    val count = engine.renderPreview()
    println("Engine rendered successfully with $count tokens processed.")
}
