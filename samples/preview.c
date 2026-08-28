/**
 * =============================================================================
 * Obsidian Neon (Dracula Syntax) - C (C17 / C23) Showcase
 * =============================================================================
 * Demonstrates:
 *   - Doxygen and inline cursive comments
 *   - Preprocessor macros, conditionals & header definitions
 *   - Structs, Unions, Bitfields, Enums & Typedefs
 *   - Function pointers, Variadic functions & Pointer arithmetic
 *   - Memory management (malloc/free), type castings & bitwise operations
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include <stdarg.h>

#define THEME_ENGINE_VERSION "1.2.31"
#define MAX_PALETTE_SIZE 32
#define CLAMP(x, low, high) (((x) > (high)) ? (high) : (((x) < (low)) ? (low) : (x)))
#define BIT(n) (1U << (n))

#pragma pack(push, 1)

// --- Enumerations ---
typedef enum {
    TOKEN_KEYWORD     = 0x01,
    TOKEN_FUNCTION    = 0x02,
    TOKEN_TYPE_DEF    = 0x04,
    TOKEN_STRING_LIT  = 0x08,
    TOKEN_NUMBER_VAL  = 0x10,
    TOKEN_COMMENT     = 0x20
} TokenType;

// --- Union for Color Representation ---
typedef union {
    uint32_t rgba;
    struct {
        uint8_t r;
        uint8_t g;
        uint8_t b;
        uint8_t a;
    } channels;
} ColorRGBA;

// --- Struct with Bitfield Flags ---
typedef struct {
    uint32_t id;
    TokenType type;
    ColorRGBA color;
    char name[32];
    struct {
        uint8_t is_bold       : 1;
        uint8_t is_italic     : 1;
        uint8_t is_underlined : 1;
        uint8_t reserved      : 5;
    } font_style;
} SyntaxToken;

#pragma pack(pop)

// --- Function Pointer Type Definition ---
typedef void (*TokenCallback)(const SyntaxToken* token, void* user_data);

/**
 * Variadic logging helper for theme engine telemetry.
 */
void neon_log(const char* level, const char* format, ...) {
    va_list args;
    va_start(args, format);
    printf("[%s] ", level);
    vprintf(format, args);
    printf("\n");
    va_end(args);
}

/**
 * Allocates and initializes a new syntax token on heap.
 */
SyntaxToken* create_neon_token(uint32_t id, TokenType type, const char* name, ColorRGBA color) {
    SyntaxToken* token = (SyntaxToken*)malloc(sizeof(SyntaxToken));
    if (token == NULL) {
        neon_log("ERROR", "Out of memory allocating SyntaxToken #%u", id);
        return NULL;
    }

    token->id = id;
    token->type = type;
    token->color = color;
    token->font_style.is_bold = (type == TOKEN_FUNCTION) ? 1 : 0;
    token->font_style.is_italic = (type == TOKEN_KEYWORD || type == TOKEN_COMMENT) ? 1 : 0;

    strncpy(token->name, name, sizeof(token->name) - 1);
    token->name[sizeof(token->name) - 1] = '\0';

    return token;
}

/**
 * Iterates through a token buffer and dispatches callbacks.
 */
void process_tokens(SyntaxToken** tokens, size_t count, TokenCallback callback, void* user_data) {
    if (!tokens || !callback) return;

    for (size_t i = 0; i < count; ++i) {
        if (tokens[i] != NULL) {
            callback(tokens[i], user_data);
        }
    }
}

static void print_token_info(const SyntaxToken* token, void* user_data) {
    int* counter = (int*)user_data;
    (*counter)++;

    printf("  -> Token [%02d]: %-15s | Color: #%02X%02X%02X | Italic: %d | Bold: %d\n",
           *counter,
           token->name,
           token->color.channels.r,
           token->color.channels.g,
           token->color.channels.b,
           token->font_style.is_italic,
           token->font_style.is_bold);
}

int main(int argc, char* argv[]) {
    neon_log("INFO", "Initializing Obsidian Neon (Dracula Syntax) - C Pipeline %s", THEME_ENGINE_VERSION);

    ColorRGBA pink_color   = { .channels = { .r = 0xFF, .g = 0x79, .b = 0xC6, .a = 0xFF } };
    ColorRGBA green_color  = { .channels = { .r = 0x50, .g = 0xFA, .b = 0x7B, .a = 0xFF } };
    ColorRGBA cyan_color   = { .channels = { .r = 0x8B, .g = 0xE9, .b = 0xFD, .a = 0xFF } };

    SyntaxToken* token_list[3];
    token_list[0] = create_neon_token(1, TOKEN_KEYWORD, "typedef struct", pink_color);
    token_list[1] = create_neon_token(2, TOKEN_FUNCTION, "create_neon_token", green_color);
    token_list[2] = create_neon_token(3, TOKEN_TYPE_DEF, "SyntaxToken*", cyan_color);

    int processed_count = 0;
    process_tokens(token_list, 3, print_token_info, &processed_count);

    // Clean up allocated heap memory
    for (size_t i = 0; i < 3; ++i) {
        free(token_list[i]);
        token_list[i] = NULL;
    }

    neon_log("SUCCESS", "Rendered %d C tokens without memory leaks.", processed_count);
    return 0;
}
