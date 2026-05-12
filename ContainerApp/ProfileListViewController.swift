import UIKit

final class ProfileListViewController: UITableViewController {
    private var profiles: [AutofillProfile] = []
    private var activeID: UUID?

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Profiles"
        navigationItem.largeTitleDisplayMode = .always
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .add, target: self, action: #selector(addProfile)
        )
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        profiles = ProfileStore.shared.loadProfiles()
        activeID = ProfileStore.shared.activeProfile()?.id
        tableView.reloadData()
    }

    @objc private func addProfile() {
        let profile = AutofillProfile(name: "New Profile")
        ProfileStore.shared.upsert(profile)
        if profiles.isEmpty {
            ProfileStore.shared.setActiveProfile(id: profile.id)
        }
        let vc = ProfileEditViewController(profile: profile)
        navigationController?.pushViewController(vc, animated: true)
    }

    // MARK: - UITableViewDataSource

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        profiles.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        let profile = profiles[indexPath.row]
        var config = cell.defaultContentConfiguration()
        config.text = profile.name.isEmpty ? "Unnamed Profile" : profile.name
        config.secondaryText = profile.id == activeID ? "Active" : nil
        config.secondaryTextProperties.color = .systemGreen
        cell.contentConfiguration = config
        cell.accessoryType = .disclosureIndicator
        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let vc = ProfileEditViewController(profile: profiles[indexPath.row])
        vc.onActivate = { [weak self] id in
            self?.activeID = id
            self?.tableView.reloadData()
        }
        navigationController?.pushViewController(vc, animated: true)
    }

    override func tableView(
        _ tableView: UITableView,
        commit editingStyle: UITableViewCell.EditingStyle,
        forRowAt indexPath: IndexPath
    ) {
        guard editingStyle == .delete else { return }
        ProfileStore.shared.delete(id: profiles[indexPath.row].id)
        profiles.remove(at: indexPath.row)
        tableView.deleteRows(at: [indexPath], with: .automatic)
    }

    override func tableView(_ tableView: UITableView, titleForFooterInSection section: Int) -> String? {
        profiles.isEmpty ? "Tap + to add a profile for yourself or anyone in your family." : nil
    }
}
