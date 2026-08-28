/**
 * =============================================================================
 * Obsidian Neon (Dracula Syntax) - C++ (C++20/23) Showcase
 * =============================================================================
 * Demonstrates:
 *   - Doxygen comments with cursive style
 *   - Concepts, Constraints & Generic Templates
 *   - Smart Pointers, Move Semantics & RAII
 *   - Modern Lambdas, Structured Bindings & std::variant
 *   - Virtual inheritance, constexpr, noexcept & operator overloading
 */

#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include <string_view>
#include <concepts>
#include <variant>
#include <optional>
#include <algorithm>
#include <chrono>

namespace Obsidian::Neon::Core {

// --- C++20 Concepts ---
template <typename T>
concept NumericChannel = std::integral<T> || std::floating_point<T>;

/**
 * High-performance RGBA color vector representation.
 */
template <NumericChannel TChannel>
struct alignas(16) ColorVector {
    TChannel r{}, g{}, b{}, a{};

    [[nodiscard]] constexpr bool is_opaque() const noexcept {
        if constexpr (std::is_floating_point_v<TChannel>) {
            return a >= 1.0f;
        } else {
            return a == 255;
        }
    }

    friend std::ostream& operator<<(std::ostream& os, const ColorVector& cv) {
        return os << "RGBA(" << +cv.r << ", " << +cv.g << ", " << +cv.b << ", " << +cv.a << ")";
    }
};

using ColorRGBA8 = ColorVector<uint8_t>;
using ColorRGBAF = ColorVector<float>;

// --- Variant Type for Poly Token Values ---
using TokenValue = std::variant<int64_t, double, std::string, bool>;

/**
 * Base Abstract Renderer for Syntax Tokens.
 */
class [[nodiscard]] IRenderPass {
public:
    virtual ~IRenderPass() = default;
    [[nodiscard]] virtual bool execute_pass(std::string_view source_code) noexcept = 0;
    [[nodiscard]] virtual std::string_view pass_name() const noexcept = 0;
};

/**
 * Dracula Syntax Highlight Processor implementation.
 */
class DraculaSyntaxPass final : public IRenderPass {
private:
    std::string m_pass_identifier;
    std::vector<std::pair<std::string, ColorRGBA8>> m_palette;
    mutable uint64_t m_render_counter{0};

public:
    explicit DraculaSyntaxPass(std::string identifier)
        : m_pass_identifier(std::move(identifier)) {
        initialize_palette();
    }

    ~DraculaSyntaxPass() override = default;

    // Delete copy, allow move
    DraculaSyntaxPass(const DraculaSyntaxPass&) = delete;
    DraculaSyntaxPass& operator=(const DraculaSyntaxPass&) = delete;
    DraculaSyntaxPass(DraculaSyntaxPass&&) noexcept = default;
    DraculaSyntaxPass& operator=(DraculaSyntaxPass&&) noexcept = default;

    [[nodiscard]] std::string_view pass_name() const noexcept override {
        return m_pass_identifier;
    }

    [[nodiscard]] bool execute_pass(std::string_view source_code) noexcept override {
        ++m_render_counter;

        // Structured binding & Lambda demonstration
        auto [first_name, first_color] = m_palette.front();

        auto contains_keyword = [source_code](std::string_view kw) noexcept -> bool {
            return source_code.find(kw) != std::string_view::npos;
        };

        return contains_keyword("template") || contains_keyword("concept");
    }

    [[nodiscard]] std::optional<ColorRGBA8> find_color_by_name(std::string_view name) const {
        auto it = std::ranges::find_if(m_palette, [name](const auto& pair) {
            return pair.first == name;
        });

        if (it != m_palette.end()) {
            return it->second;
        }
        return std::nullopt;
    }

private:
    void initialize_palette() {
        m_palette.reserve(4);
        m_palette.emplace_back("HotPink_Keyword",   ColorRGBA8{255, 121, 198, 255});
        m_palette.emplace_back("NeonGreen_Function", ColorRGBA8{80,  250, 123, 255});
        m_palette.emplace_back("Cyan_Type",          ColorRGBA8{139, 233, 253, 255});
        m_palette.emplace_back("Purple_Constant",    ColorRGBA8{189, 147, 249, 255});
    }
};

} // namespace Obsidian::Neon::Core

// --- Entry Point ---
int main() {
    using namespace Obsidian::Neon::Core;

    std::cout << "✨ Obsidian Neon (Dracula Syntax) - C++ Engine Initialized" << '\n';

    std::unique_ptr<IRenderPass> pass = std::make_unique<DraculaSyntaxPass>("Dracula Syntax Pipeline V3");

    constexpr std::string_view sample_code = "template <typename T> concept Glowing = true;";

    if (pass->execute_pass(sample_code)) {
        std::cout << "Pass [" << pass->pass_name() << "] successfully processed AST." << '\n';
    }

    return 0;
}
