import UIKit

final class StandardFieldCell: UITableViewCell {
    static let reuseID = "StandardFieldCell"

    var onValueChanged: ((String) -> Void)?

    private let nameLabel = UILabel()
    let valueField = UITextField()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setup()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func setup() {
        selectionStyle = .none

        nameLabel.font = .systemFont(ofSize: 13, weight: .medium)
        nameLabel.textColor = .secondaryLabel
        nameLabel.translatesAutoresizingMaskIntoConstraints = false

        valueField.font = .systemFont(ofSize: 16)
        valueField.borderStyle = .none
        valueField.clearButtonMode = .whileEditing
        valueField.translatesAutoresizingMaskIntoConstraints = false
        valueField.addTarget(self, action: #selector(textChanged), for: .editingChanged)

        contentView.addSubview(nameLabel)
        contentView.addSubview(valueField)

        NSLayoutConstraint.activate([
            nameLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 10),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            nameLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),

            valueField.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 3),
            valueField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            valueField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            valueField.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -10),
        ])
    }

    func configure(
        label: String,
        value: String,
        contentType: UITextContentType? = nil,
        keyboardType: UIKeyboardType = .default,
        isSecure: Bool = false
    ) {
        nameLabel.text = label.uppercased()
        valueField.text = value
        valueField.placeholder = label
        valueField.textContentType = contentType
        valueField.keyboardType = keyboardType
        valueField.isSecureTextEntry = isSecure
    }

    @objc private func textChanged() {
        onValueChanged?(valueField.text ?? "")
    }
}
