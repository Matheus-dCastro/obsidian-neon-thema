/**
 * =============================================================================
 * Obsidian Neon (Dracula Syntax) - Java 21+ Showcase
 * =============================================================================
 * Demonstrates:
 *   - Javadoc & block comments with cursive styling
 *   - Records, Sealed Interfaces, Pattern Matching Switch (Java 21)
 *   - Generics, Annotations, Lambda Expressions, Method References
 *   - Multiline Text Blocks, Streams API & CompletableFuture
 */

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

// --- Data Structures & Sealed Hierarchy ---

/**
 * Immutable record representing a 24-bit RGB neon color swatch.
 */
record ThemeColor(String name, int red, int green, int blue, boolean isAccent) {
    public static final ThemeColor BACKGROUND = new ThemeColor("Obsidian Base", 25, 21, 37, false);
    public static final ThemeColor HOT_PINK = new ThemeColor("Keyword Pink", 255, 121, 198, true);
    public static final ThemeColor NEON_GREEN = new ThemeColor("Method Green", 80, 250, 123, true);

    public String toHex() {
        return String.format("#%02X%02X%02X", red, green, blue);
    }
}

sealed interface RenderEvent permits TokenHighlightEvent, DiagnosticEvent, LayoutChangeEvent {}

final class TokenHighlightEvent implements RenderEvent {
    private final String tokenScope;
    private final ThemeColor appliedColor;

    public TokenHighlightEvent(String tokenScope, ThemeColor appliedColor) {
        this.tokenScope = Objects.requireNonNull(tokenScope);
        this.appliedColor = appliedColor;
    }

    public String getTokenScope() { return tokenScope; }
    public ThemeColor getAppliedColor() { return appliedColor; }
}

final class DiagnosticEvent implements RenderEvent {
    private final String severity;
    public DiagnosticEvent(String severity) { this.severity = severity; }
    public String getSeverity() { return severity; }
}

final class LayoutChangeEvent implements RenderEvent {}

@FunctionalInterface
interface TokenTransformer<T, R> {
    R transform(T input) throws Exception;
}

/**
 * Main syntax processing coordinator.
 */
class Preview {

    private final List<ThemeColor> registeredColors = new ArrayList<>();
    public volatile boolean isRunning = false;

    public Preview() {
        registeredColors.addAll(List.of(
            ThemeColor.BACKGROUND,
            ThemeColor.HOT_PINK,
            ThemeColor.NEON_GREEN,
            new ThemeColor("Cyan Type", 139, 233, 253, true),
            new ThemeColor("Orange Param", 255, 184, 108, false)
        ));
    }

    /**
     * Processes events using Java 21 pattern matching switch with guard (when).
     */
    public String inspectEvent(RenderEvent event) {
        return switch (event) {
            case TokenHighlightEvent th when th.getAppliedColor().isAccent() ->
                "Highlighted accent token: " + th.getTokenScope() + " -> " + th.getAppliedColor().toHex();
            case TokenHighlightEvent th ->
                "Regular token: " + th.getTokenScope();
            case DiagnosticEvent d ->
                "Diagnostic warning suppressed with level: " + d.getSeverity();
            case LayoutChangeEvent l ->
                "Editor workbench layout updated.";
        };
    }

    /**
     * Executes asynchronous pipeline using CompletableFuture and Java Streams.
     */
    public CompletableFuture<List<String>> processPaletteAsync() {
        return CompletableFuture.supplyAsync(() -> {
            this.isRunning = true;

            // Multiline string literal (Java 15+)
            String manifestJson = """
                {
                    "theme": "Obsidian Neon",
                    "variant": "Dracula Syntax",
                    "timestamp": "%s"
                }
                """.formatted(Instant.now());
            System.out.println("Loaded config: " + manifestJson.length() + " bytes");

            return registeredColors.stream()
                .filter(ThemeColor::isAccent)
                .map(color -> color.name().toUpperCase() + " [" + color.toHex() + "]")
                .sorted(Comparator.naturalOrder())
                .collect(Collectors.toList());
        });
    }

    public static void main(String[] args) throws Exception {
        System.out.println("⚡ Initializing Obsidian Neon Java Engine...");

        var engine = new Preview();
        var sampleEvent = new TokenHighlightEvent("keyword.control.java", ThemeColor.HOT_PINK);

        System.out.println(engine.inspectEvent(sampleEvent));

        TokenTransformer<ThemeColor, String> transformer = ThemeColor::toHex;
        System.out.println("Transformed hot pink: " + transformer.transform(ThemeColor.HOT_PINK));

        engine.processPaletteAsync().thenAccept(results -> {
            System.out.println("Palette Results:");
            results.forEach(System.out::println);
        }).join();
    }
}
