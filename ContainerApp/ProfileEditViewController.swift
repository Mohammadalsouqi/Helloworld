import UIKit

final class ProfileEditViewController: UITableViewController {
    var onActivate: ((UUID) -> Void)?

    private var profile: AutofillProfile

    // Standard field definitions
    private struct FieldDef {
        let label: String
        let contentType: UITextContentType?
        let keyboardType: UIKeyboardType
        let isSecure: Bool
        let get: (AutofillProfile) -> String
        let set: (inout AutofillProfile, String) -> Void
    }

    private let sections: [(title: String, fields: [FieldDef])] = [
        ("Personal", [
            FieldDef(label: "Full Name",    contentType: .name,           keyboardType: .default,      isSecure: false, get: { $0.fullName },       set: { $0.fullName = $1 }),
            FieldDef(label: "First Name",   contentType: .givenName,      keyboardType: .default,      isSecure: false, get: { $0.givenName },      set: { $0.givenName = $1 }),
            FieldDef(label: "Last Name",    contentType: .familyName,     keyboardType: .default,      isSecure: false, get: { $0.familyName },     set: { $0.familyName = $1 }),
            FieldDef(label: "Email",        contentType: .emailAddress,   keyboardType: .emailAddress, isSecure: false, get: { $0.emailAddress },   set: { $0.emailAddress = $1 }),
            FieldDef(label: "Phone",        contentType: .telephoneNumber,keyboardType: .phonePad,     isSecure: false, get: { $0.phoneNumber },    set: { $0.phoneNumber = $1 }),
        ]),
        ("Address", [
            FieldDef(label: "Street",       contentType: .streetAddressLine1, keyboardType: .default,  isSecure: false, get: { $0.streetAddress },  set: { $0.streetAddress = $1 }),
            FieldDef(label: "City",         contentType: .addressCity,        keyboardType: .default,  isSecure: false, get: { $0.city },           set: { $0.city = $1 }),
            FieldDef(label: "State",        contentType: .addressState,       keyboardType: .default,  isSecure: false, get: { $0.state },          set: { $0.state = $1 }),
            FieldDef(label: "Postal Code",  contentType: .postalCode,         keyboardType: .numbersAndPunctuation, isSecure: false, get: { $0.postalCode }, set: { $0.postalCode = $1 }),
            FieldDef(label: "Country",      contentType: .countryName,        keyboardType: .default,  isSecure: false, get: { $0.countryCode },    set: { $0.countryCode = $1 }),
        ]),
        ("Account", [
            FieldDef(label: "Username",     contentType: .username,       keyboardType: .default,      isSecure: false, get: { $0.username },       set: { $0.username = $1 }),
            FieldDef(label: "Password",     contentType: .password,       keyboardType: .default,      isSecure: true,  get: { $0.password },       set: { $0.password = $1 }),
        ]),
        ("Identity", [
            FieldDef(label: "National ID",     contentType: nil,          keyboardType: .default,      isSecure: false, get: { $0.nationalID },     set: { $0.nationalID = $1 }),
            FieldDef(label: "Passport Number", contentType: nil,          keyboardType: .default,      isSecure: false, get: { $0.passportNumber }, set: { $0.passportNumber = $1 }),
        ]),
        ("Payment", [
            FieldDef(label: "Card Number",  contentType: .creditCardNumber, keyboardType: .numberPad,  isSecure: false, get: { $0.creditCardNumber }, set: { $0.creditCardNumber = $1 }),
            FieldDef(label: "Expiry",       contentType: nil,               keyboardType: .numbersAndPunctuation, isSecure: false, get: { $0.creditCardExpiry }, set: { $0.creditCardExpiry = $1 }),
        ]),
    ]

    // Custom fields section index = sections.count
    private var customSection: Int { sections.count }

    init(profile: AutofillProfile) {
        self.profile = profile
        super.init(style: .insetGrouped)
    }

    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        title = profile.name.isEmpty ? "New Profile" : profile.name
        navigationItem.largeTitleDisplayMode = .never
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .save, target: self, action: #selector(save)
        )
        tableView.register(StandardFieldCell.self, forCellReuseIdentifier: StandardFieldCell.reuseID)
        tableView.register(CustomFieldCell.self, forCellReuseIdentifier: CustomFieldCell.reuseID)
        tableView.keyboardDismissMode = .onDrag
    }

    @objc private func save() {
        ProfileStore.shared.upsert(profile)
        navigationController?.popViewController(animated: true)
    }

    // MARK: - Table structure

    // Sections: [name] + [standard sections] + [custom fields]
    override func numberOfSections(in tableView: UITableView) -> Int {
        // +1 for profile name, +1 for custom fields, +1 for actions
        return 1 + sections.count + 1 + 1
    }

    private var actionSection: Int { sections.count + 2 }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0: return 1                                        // profile name
        case 1...sections.count: return sections[section - 1].fields.count
        case customSection + 1: return profile.customFields.count + 1  // fields + "Add" row
        case actionSection: return 1                             // Set as Active
        default: return 0
        }
    }

    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0: return "Profile Name"
        case 1...sections.count: return sections[section - 1].title
        case customSection + 1: return "Custom Fields"
        default: return nil
        }
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let section = indexPath.section

        // Profile name row
        if section == 0 {
            let cell = tableView.dequeueReusableCell(withIdentifier: StandardFieldCell.reuseID, for: indexPath) as! StandardFieldCell
            cell.configure(label: "Name", value: profile.name)
            cell.onValueChanged = { [weak self] v in
                self?.profile.name = v
                self?.title = v.isEmpty ? "New Profile" : v
            }
            return cell
        }

        // Standard field sections
        if section >= 1 && section <= sections.count {
            let def = sections[section - 1].fields[indexPath.row]
            let cell = tableView.dequeueReusableCell(withIdentifier: StandardFieldCell.reuseID, for: indexPath) as! StandardFieldCell
            cell.configure(label: def.label, value: def.get(profile), contentType: def.contentType, keyboardType: def.keyboardType, isSecure: def.isSecure)
            cell.onValueChanged = { [weak self] v in
                guard var s = self else { return }
                def.set(&s.profile, v)
            }
            return cell
        }

        // Custom fields section
        if section == customSection + 1 {
            if indexPath.row < profile.customFields.count {
                let cell = tableView.dequeueReusableCell(withIdentifier: CustomFieldCell.reuseID, for: indexPath) as! CustomFieldCell
                let row = indexPath.row
                cell.configure(label: profile.customFields[row].label, value: profile.customFields[row].value)
                cell.onLabelChanged = { [weak self] v in self?.profile.customFields[row].label = v }
                cell.onValueChanged = { [weak self] v in self?.profile.customFields[row].value = v }
                return cell
            } else {
                // "Add custom field" row
                var config = UIListContentConfiguration.cell()
                config.text = "Add Custom Field"
                config.textProperties.color = .systemBlue
                let cell = UITableViewCell()
                cell.contentConfiguration = config
                return cell
            }
        }

        // Action section
        var config = UIListContentConfiguration.cell()
        let isActive = ProfileStore.shared.activeProfile()?.id == profile.id
        config.text = isActive ? "Active Profile ✓" : "Set as Active Profile"
        config.textProperties.color = isActive ? .secondaryLabel : .systemBlue
        let cell = UITableViewCell()
        cell.contentConfiguration = config
        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let section = indexPath.section

        // Add custom field
        if section == customSection + 1 && indexPath.row == profile.customFields.count {
            profile.customFields.append(CustomField())
            tableView.insertRows(at: [IndexPath(row: profile.customFields.count - 1, section: section)], with: .automatic)
            return
        }

        // Set as active
        if section == actionSection {
            ProfileStore.shared.upsert(profile)
            ProfileStore.shared.setActiveProfile(id: profile.id)
            onActivate?(profile.id)
            tableView.reloadSections([actionSection], with: .automatic)
        }
    }

    override func tableView(
        _ tableView: UITableView,
        commit editingStyle: UITableViewCell.EditingStyle,
        forRowAt indexPath: IndexPath
    ) {
        guard editingStyle == .delete,
              indexPath.section == customSection + 1,
              indexPath.row < profile.customFields.count else { return }
        profile.customFields.remove(at: indexPath.row)
        tableView.deleteRows(at: [indexPath], with: .automatic)
    }

    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        indexPath.section == customSection + 1 && indexPath.row < profile.customFields.count
    }
}
