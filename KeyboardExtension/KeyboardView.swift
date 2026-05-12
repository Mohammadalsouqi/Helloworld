import UIKit

final class KeyboardView: UIView {

    // Callbacks to the view controller
    var onKeyTapped: ((String) -> Void)?
    var onDeleteTapped: (() -> Void)?
    var onDeleteHeld: (() -> Void)?
    var onDeleteReleased: (() -> Void)?
    var onReturnTapped: (() -> Void)?
    var onGlobeTapped: (() -> Void)?
    var onShiftTapped: (() -> Void)?
    var on123Tapped: (() -> Void)?

    private(set) var isShifted = false {
        didSet { letterKeys.forEach { $0.setShifted(isShifted) } }
    }

    private var letterKeys: [KeyboardKey] = []
    private var shiftKey: KeyboardKey?
    private var globeKey: KeyboardKey?

    private enum Mode { case letters, numbers }
    private var mode: Mode = .letters

    private let letterRows: [[String]] = [
        ["q","w","e","r","t","y","u","i","o","p"],
        ["a","s","d","f","g","h","j","k","l"],
        ["z","x","c","v","b","n","m"],
    ]
    private let numberRows: [[String]] = [
        ["1","2","3","4","5","6","7","8","9","0"],
        ["-","/",":",";","(",")",  "$","&","@","\""],
        [".",",","?","!","'"],
    ]

    override init(frame: CGRect) {
        super.init(frame: frame)
        build()
    }

    required init?(coder: NSCoder) { fatalError() }

    func setGlobeVisible(_ visible: Bool) {
        globeKey?.isHidden = !visible
    }

    func setShifted(_ shifted: Bool) {
        isShifted = shifted
        shiftKey?.backgroundColor = shifted ? .systemGray2 : UIColor.systemGray4
    }

    func switchToLetters() {
        mode = .letters
        rebuild()
    }

    func switchToNumbers() {
        mode = .numbers
        rebuild()
    }

    // MARK: - Build

    private func build() {
        backgroundColor = UIColor(red: 0.82, green: 0.84, blue: 0.86, alpha: 1)
        rebuild()
    }

    private func rebuild() {
        subviews.forEach { $0.removeFromSuperview() }
        letterKeys.removeAll()

        let rows = mode == .letters ? letterRows : numberRows
        let outerStack = UIStackView()
        outerStack.axis = .vertical
        outerStack.spacing = 11
        outerStack.translatesAutoresizingMaskIntoConstraints = false

        for (rowIndex, row) in rows.enumerated() {
            let rowStack = makeRowStack()

            if mode == .letters && rowIndex == 2 {
                // Add shift key on left
                let shift = makeKey(type: .function("⇧"))
                shiftKey = shift
                shift.widthAnchor.constraint(equalToConstant: 42).isActive = true
                shift.addTarget(self, action: #selector(shiftTapped), for: .touchUpInside)
                rowStack.addArrangedSubview(shift)
            }

            if mode == .numbers && rowIndex == 2 {
                let symbols = makeKey(type: .function("#+="))
                symbols.widthAnchor.constraint(equalToConstant: 42).isActive = true
                rowStack.addArrangedSubview(symbols)
            }

            for char in row {
                let key = makeKey(type: mode == .letters ? .letter(char) : .function(char))
                if mode == .letters {
                    letterKeys.append(key)
                    key.addTarget(self, action: #selector(letterTapped(_:)), for: .touchUpInside)
                } else {
                    key.addTarget(self, action: #selector(letterTapped(_:)), for: .touchUpInside)
                }
                rowStack.addArrangedSubview(key)
            }

            if mode == .letters && rowIndex == 2 {
                let del = makeKey(type: .function("⌫"))
                del.widthAnchor.constraint(equalToConstant: 42).isActive = true
                del.addTarget(self, action: #selector(deleteTapped), for: .touchUpInside)
                del.addTarget(self, action: #selector(deleteDown), for: .touchDown)
                del.addTarget(self, action: #selector(deleteUp), for: [.touchUpInside, .touchUpOutside, .touchCancel])
                rowStack.addArrangedSubview(del)
            }

            if mode == .numbers && rowIndex == 2 {
                let del = makeKey(type: .function("⌫"))
                del.widthAnchor.constraint(equalToConstant: 42).isActive = true
                del.addTarget(self, action: #selector(deleteTapped), for: .touchUpInside)
                del.addTarget(self, action: #selector(deleteDown), for: .touchDown)
                del.addTarget(self, action: #selector(deleteUp), for: [.touchUpInside, .touchUpOutside, .touchCancel])
                rowStack.addArrangedSubview(del)
            }

            outerStack.addArrangedSubview(rowStack)
        }

        // Bottom row: globe | 123/ABC | space | return
        let bottomRow = makeRowStack()
        bottomRow.spacing = 6

        let globe = makeKey(type: .function("🌐"))
        globeKey = globe
        globe.widthAnchor.constraint(equalToConstant: 42).isActive = true
        globe.addTarget(self, action: #selector(globeTapped), for: .touchUpInside)
        bottomRow.addArrangedSubview(globe)

        let toggle = makeKey(type: .function(mode == .letters ? "123" : "ABC"))
        toggle.widthAnchor.constraint(equalToConstant: 42).isActive = true
        toggle.addTarget(self, action: #selector(toggleMode), for: .touchUpInside)
        bottomRow.addArrangedSubview(toggle)

        let space = makeKey(type: .space)
        bottomRow.addArrangedSubview(space)

        let ret = makeKey(type: .function("return"))
        ret.widthAnchor.constraint(equalToConstant: 80).isActive = true
        ret.addTarget(self, action: #selector(returnTapped), for: .touchUpInside)
        bottomRow.addArrangedSubview(ret)

        outerStack.addArrangedSubview(bottomRow)

        addSubview(outerStack)
        NSLayoutConstraint.activate([
            outerStack.topAnchor.constraint(equalTo: topAnchor, constant: 8),
            outerStack.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 5),
            outerStack.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -5),
            outerStack.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -8),
        ])

        // Apply current shift state
        letterKeys.forEach { $0.setShifted(isShifted) }
    }

    // MARK: - Factory

    private func makeRowStack() -> UIStackView {
        let s = UIStackView()
        s.axis = .horizontal
        s.spacing = 6
        s.distribution = .fillEqually
        s.alignment = .fill
        return s
    }

    private func makeKey(type: KeyType) -> KeyboardKey {
        let k = KeyboardKey(type: type)
        k.heightAnchor.constraint(equalToConstant: 42).isActive = true
        return k
    }

    // MARK: - Actions

    @objc private func letterTapped(_ sender: KeyboardKey) {
        onKeyTapped?(sender.character)
    }

    @objc private func deleteTapped() { onDeleteTapped?() }
    @objc private func deleteDown()   { onDeleteHeld?() }
    @objc private func deleteUp()     { onDeleteReleased?() }
    @objc private func returnTapped() { onReturnTapped?() }
    @objc private func globeTapped()  { onGlobeTapped?() }

    @objc private func shiftTapped() {
        setShifted(!isShifted)
        onShiftTapped?()
    }

    @objc private func toggleMode() {
        if mode == .letters { switchToNumbers() } else { switchToLetters() }
        on123Tapped?()
    }
}
