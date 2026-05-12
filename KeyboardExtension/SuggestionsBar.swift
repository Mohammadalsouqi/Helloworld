import UIKit

final class SuggestionsBar: UIView {

    var onSuggestionTapped: ((String) -> Void)?
    var onProfileSwitched: (() -> Void)?

    private let scrollView = UIScrollView()
    private let chipStack = UIStackView()
    private let profileButton = UIButton(type: .system)

    override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }

    required init?(coder: NSCoder) { fatalError() }

    override var intrinsicContentSize: CGSize {
        CGSize(width: UIView.noIntrinsicMetric, height: 44)
    }

    // MARK: - Public

    func update(chips: [SuggestionChip], profileName: String) {
        profileButton.setTitle(profileName.isEmpty ? "Profile" : profileName, for: .normal)

        chipStack.arrangedSubviews.forEach {
            chipStack.removeArrangedSubview($0)
            $0.removeFromSuperview()
        }

        if chips.isEmpty {
            chipStack.addArrangedSubview(makePlaceholderChip())
            return
        }

        for chip in chips {
            chipStack.addArrangedSubview(makeChip(chip))
        }
    }

    func showNoAccess() {
        update(chips: [], profileName: "—")
        chipStack.arrangedSubviews.forEach {
            chipStack.removeArrangedSubview($0)
            $0.removeFromSuperview()
        }
        chipStack.addArrangedSubview(makeInfoChip("Enable Full Access in Settings", color: .systemOrange))
    }

    func showNoProfile() {
        update(chips: [], profileName: "—")
        chipStack.arrangedSubviews.forEach {
            chipStack.removeArrangedSubview($0)
            $0.removeFromSuperview()
        }
        chipStack.addArrangedSubview(makeInfoChip("Add a profile in the app", color: .systemBlue))
    }

    // MARK: - Setup

    private func setup() {
        backgroundColor = UIColor(red: 0.82, green: 0.84, blue: 0.86, alpha: 1)

        // Hairline top border
        let line = UIView()
        line.backgroundColor = .separator
        line.translatesAutoresizingMaskIntoConstraints = false
        addSubview(line)

        // Chip scroll area
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(scrollView)

        chipStack.axis = .horizontal
        chipStack.spacing = 8
        chipStack.alignment = .center
        chipStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(chipStack)

        // Profile switcher button (right side)
        var config = UIButton.Configuration.tinted()
        config.buttonSize = .small
        config.cornerStyle = .capsule
        profileButton.configuration = config
        profileButton.translatesAutoresizingMaskIntoConstraints = false
        profileButton.addTarget(self, action: #selector(switchProfile), for: .touchUpInside)
        addSubview(profileButton)

        NSLayoutConstraint.activate([
            line.topAnchor.constraint(equalTo: topAnchor),
            line.leadingAnchor.constraint(equalTo: leadingAnchor),
            line.trailingAnchor.constraint(equalTo: trailingAnchor),
            line.heightAnchor.constraint(equalToConstant: 0.5),

            profileButton.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -8),
            profileButton.centerYAnchor.constraint(equalTo: centerYAnchor),

            scrollView.topAnchor.constraint(equalTo: topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: bottomAnchor),
            scrollView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 6),
            scrollView.trailingAnchor.constraint(equalTo: profileButton.leadingAnchor, constant: -6),

            chipStack.topAnchor.constraint(equalTo: scrollView.topAnchor),
            chipStack.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            chipStack.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            chipStack.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            chipStack.heightAnchor.constraint(equalTo: scrollView.heightAnchor),
        ])
    }

    // MARK: - Chip factories

    private func makeChip(_ chip: SuggestionChip) -> UIButton {
        var config = UIButton.Configuration.filled()
        config.title = chip.displayText
        config.buttonSize = .small
        config.cornerStyle = .capsule
        config.baseBackgroundColor = .systemBackground
        config.baseForegroundColor = chip.isMasked ? .systemOrange : .label

        let button = UIButton(configuration: config)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.addAction(UIAction { [weak self] _ in
            self?.onSuggestionTapped?(chip.insertionText)
        }, for: .touchUpInside)
        return button
    }

    private func makePlaceholderChip() -> UIView {
        let label = UILabel()
        label.text = "No suggestions"
        label.font = .systemFont(ofSize: 13)
        label.textColor = .tertiaryLabel
        return label
    }

    private func makeInfoChip(_ text: String, color: UIColor) -> UIButton {
        var config = UIButton.Configuration.tinted()
        config.title = text
        config.buttonSize = .small
        config.cornerStyle = .capsule
        config.baseBackgroundColor = color
        let button = UIButton(configuration: config)
        button.isEnabled = false
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }

    // MARK: - Actions

    @objc private func switchProfile() {
        // Cycle to next profile
        let profiles = ProfileStore.shared.loadProfiles()
        guard profiles.count > 1,
              let current = ProfileStore.shared.activeProfile(),
              let idx = profiles.firstIndex(where: { $0.id == current.id }) else { return }
        let next = profiles[(idx + 1) % profiles.count]
        ProfileStore.shared.setActiveProfile(id: next.id)
        onProfileSwitched?()
    }
}
