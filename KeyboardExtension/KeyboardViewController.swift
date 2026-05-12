import UIKit

final class KeyboardViewController: UIInputViewController {

    private let suggestionsBar = SuggestionsBar()
    private let keyboardView = KeyboardView()
    private var provider = AutofillProvider()
    private let detector = LabelDetector()
    private var deleteTimer: Timer?

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let inputView else { return }
        inputView.allowsSelfSizing = true
        inputView.backgroundColor = UIColor(red: 0.82, green: 0.84, blue: 0.86, alpha: 1)

        // Layout: suggestionsBar on top, keyboard below
        suggestionsBar.translatesAutoresizingMaskIntoConstraints = false
        keyboardView.translatesAutoresizingMaskIntoConstraints = false

        inputView.addSubview(suggestionsBar)
        inputView.addSubview(keyboardView)

        NSLayoutConstraint.activate([
            suggestionsBar.topAnchor.constraint(equalTo: inputView.topAnchor),
            suggestionsBar.leadingAnchor.constraint(equalTo: inputView.leadingAnchor),
            suggestionsBar.trailingAnchor.constraint(equalTo: inputView.trailingAnchor),
            suggestionsBar.heightAnchor.constraint(equalToConstant: 44),

            keyboardView.topAnchor.constraint(equalTo: suggestionsBar.bottomAnchor),
            keyboardView.leadingAnchor.constraint(equalTo: inputView.leadingAnchor),
            keyboardView.trailingAnchor.constraint(equalTo: inputView.trailingAnchor),
            keyboardView.bottomAnchor.constraint(equalTo: inputView.bottomAnchor),
        ])

        wireKeyboard()
        keyboardView.setGlobeVisible(needsInputModeSwitchKey)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        provider = AutofillProvider()
        refreshSuggestions()
    }

    override func textDidChange(_ textInput: (any UITextInput)?) {
        super.textDidChange(textInput)
        refreshSuggestions()
    }

    // MARK: - Suggestions

    private func refreshSuggestions() {
        guard SharedDefaults.shared.isAvailable else {
            suggestionsBar.showNoAccess()
            return
        }

        guard let profile = ProfileStore.shared.activeProfile() else {
            suggestionsBar.showNoProfile()
            return
        }

        let proxy = textDocumentProxy
        let fieldType = detector.detectFieldType(
            proxy: proxy,
            contentType: proxy.keyboardAppearance != nil ? proxy.textContentType : proxy.textContentType,
            keyboardType: proxy.keyboardType ?? .default,
            customFieldLabels: provider.customFieldLabels
        )

        let chips = provider.suggestions(for: fieldType)
        suggestionsBar.update(chips: chips, profileName: profile.name)
    }

    // MARK: - Wire keyboard callbacks

    private func wireKeyboard() {
        keyboardView.onKeyTapped = { [weak self] char in
            self?.textDocumentProxy.insertText(char)
            // Auto-release one-shot shift
            if self?.keyboardView.isShifted == true {
                self?.keyboardView.setShifted(false)
            }
        }

        keyboardView.onDeleteTapped = { [weak self] in
            self?.textDocumentProxy.deleteBackward()
        }

        keyboardView.onDeleteHeld = { [weak self] in
            self?.startDeleteRepeat()
        }

        keyboardView.onDeleteReleased = { [weak self] in
            self?.stopDeleteRepeat()
        }

        keyboardView.onReturnTapped = { [weak self] in
            self?.textDocumentProxy.insertText("\n")
        }

        keyboardView.onGlobeTapped = { [weak self] in
            self?.advanceToNextInputMode()
        }

        keyboardView.onShiftTapped = { }

        keyboardView.on123Tapped = { }

        suggestionsBar.onSuggestionTapped = { [weak self] text in
            self?.textDocumentProxy.insertText(text)
        }

        suggestionsBar.onProfileSwitched = { [weak self] in
            self?.provider = AutofillProvider()
            self?.refreshSuggestions()
        }
    }

    // MARK: - Continuous delete

    private func startDeleteRepeat() {
        stopDeleteRepeat()
        // Initial delay before repeat starts
        deleteTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: false) { [weak self] _ in
            self?.deleteTimer = Timer.scheduledTimer(withTimeInterval: 0.08, repeats: true) { [weak self] _ in
                self?.textDocumentProxy.deleteBackward()
            }
        }
    }

    private func stopDeleteRepeat() {
        deleteTimer?.invalidate()
        deleteTimer = nil
    }
}
