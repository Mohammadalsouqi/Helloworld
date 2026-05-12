import UIKit

final class CustomFieldCell: UITableViewCell {
    static let reuseID = "CustomFieldCell"

    var onLabelChanged: ((String) -> Void)?
    var onValueChanged: ((String) -> Void)?

    let labelField = UITextField()
    let valueField = UITextField()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setup()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func setup() {
        selectionStyle = .none

        labelField.font = .systemFont(ofSize: 13, weight: .medium)
        labelField.textColor = .secondaryLabel
        labelField.placeholder = "Field name (e.g. Passport Number / رقم جواز السفر)"
        labelField.borderStyle = .none
        labelField.returnKeyType = .next
        labelField.translatesAutoresizingMaskIntoConstraints = false
        labelField.addTarget(self, action: #selector(labelChanged), for: .editingChanged)

        let divider = UIView()
        divider.backgroundColor = .separator
        divider.translatesAutoresizingMaskIntoConstraints = false

        valueField.font = .systemFont(ofSize: 16)
        valueField.placeholder = "Value"
        valueField.borderStyle = .none
        valueField.clearButtonMode = .whileEditing
        valueField.translatesAutoresizingMaskIntoConstraints = false
        valueField.addTarget(self, action: #selector(valueChanged), for: .editingChanged)

        contentView.addSubview(labelField)
        contentView.addSubview(divider)
        contentView.addSubview(valueField)

        NSLayoutConstraint.activate([
            labelField.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 10),
            labelField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            labelField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),

            divider.topAnchor.constraint(equalTo: labelField.bottomAnchor, constant: 4),
            divider.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            divider.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            divider.heightAnchor.constraint(equalToConstant: 0.5),

            valueField.topAnchor.constraint(equalTo: divider.bottomAnchor, constant: 4),
            valueField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            valueField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            valueField.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -10),
        ])
    }

    func configure(label: String, value: String) {
        labelField.text = label
        valueField.text = value
    }

    @objc private func labelChanged() { onLabelChanged?(labelField.text ?? "") }
    @objc private func valueChanged() { onValueChanged?(valueField.text ?? "") }
}
