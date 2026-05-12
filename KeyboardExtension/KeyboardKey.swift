import UIKit

enum KeyType {
    case letter(String)
    case function(String)   // delete, return, shift, globe, 123/ABC
    case space
}

final class KeyboardKey: UIButton {
    let keyType: KeyType
    var character: String

    private let normalColor: UIColor
    private let pressedColor = UIColor.systemGray3

    init(type keyType: KeyType) {
        self.keyType = keyType
        switch keyType {
        case .letter(let c):
            character = c
            normalColor = .white
        case .function(let label):
            character = label
            normalColor = UIColor.systemGray4
        case .space:
            character = " "
            normalColor = .white
        }
        super.init(frame: .zero)
        setupAppearance()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func setupAppearance() {
        translatesAutoresizingMaskIntoConstraints = false
        layer.cornerRadius = 5
        layer.shadowColor = UIColor.black.cgColor
        layer.shadowOpacity = 0.3
        layer.shadowRadius = 0.5
        layer.shadowOffset = CGSize(width: 0, height: 1)

        backgroundColor = normalColor

        switch keyType {
        case .letter(let c):
            setTitle(c, for: .normal)
            setTitleColor(.black, for: .normal)
            titleLabel?.font = .systemFont(ofSize: 17)
        case .function(let label):
            setTitle(label, for: .normal)
            setTitleColor(.black, for: .normal)
            titleLabel?.font = .systemFont(ofSize: 15, weight: .medium)
        case .space:
            setTitle("space", for: .normal)
            setTitleColor(.black, for: .normal)
            titleLabel?.font = .systemFont(ofSize: 16)
        }

        addTarget(self, action: #selector(touchBegan), for: .touchDown)
        addTarget(self, action: #selector(touchEnded), for: [.touchUpInside, .touchUpOutside, .touchCancel])
    }

    @objc private func touchBegan() { backgroundColor = pressedColor }
    @objc private func touchEnded() { backgroundColor = normalColor }

    func setShifted(_ shifted: Bool) {
        guard case .letter = keyType else { return }
        character = shifted ? character.uppercased() : character.lowercased()
        setTitle(character, for: .normal)
    }
}
