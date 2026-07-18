interface EmojiKeyboardProps {
  onEmojiTap: (emoji: string) => void;
  onBack: () => void;
}

// 子ども向け絵文字
const EMOJI_CATEGORIES = {
  'どうぶつ': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🐢', '🐍', '🦎', '🐙', '🦑', '🦐', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐊'],
  'たべもの': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌽', '🥕', '🧅', '🥔', '🍠', '🍞', '🥐', '🥖', '🍕', '🍔', '🍟', '🌭', '🍿', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮', '🍦', '🍧'],
  'のりもの': ['🚗', '🚕', '🚌', '🚎', '🚑', '🚒', '🚐', '🛻', '🚚', '🚜', '🏎️', '🏍️', '🚲', '🛵', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '✈️', '🚀', '🛸', '🚁', '⛵', '🚤', '🛥️', '🚢'],
  'しぜん': ['🌸', '🌷', '🌹', '🌻', '🌼', '🌺', '🪻', '🌳', '🌴', '🌵', '🍀', '🍁', '🍂', '☀️', '🌙', '⭐', '🌈', '☁️', '⛅', '🌧️', '⛈️', '❄️', '💧', '🌊', '🔥', '🌍'],
  'かお': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😜', '🤪', '😎', '🤗', '🤔', '😴', '😪', '😱', '😭', '🥺', '😤', '👻', '👽', '🤖', '💀', '👾'],
  'その他': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💕', '💖', '✨', '🎉', '🎊', '🎈', '🎁', '🎀', '🏆', '🥇', '🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '⚽', '🏀', '🎾', '⚾', '🎯', '🎮', '🧩', '🎨', '📚', '✏️', '🔔', '💡'],
};

export function EmojiKeyboard({ onEmojiTap, onBack }: EmojiKeyboardProps) {
  return (
    <div className="emoji-keyboard">
      <button className="emoji-back-button" onClick={onBack}>
        ← ひらがなにもどる
      </button>
      {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
        <div key={category} className="emoji-category">
          <div className="emoji-category-label">{category}</div>
          <div className="emoji-grid">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                className="emoji-button"
                onClick={() => onEmojiTap(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
