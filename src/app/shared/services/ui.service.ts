import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UiService {
	showJobModal = signal(false);
	selectedJob = signal<any>(null);
	showNewsModal = signal(false);
	selectedNews = signal<any>(null);
	showContactModal = signal(false);
	selectedContact = signal<any>(null);
	showSuccessToast = signal(false);

	userName = signal('');
	userMail = signal('');
	userMessage = signal('');

	openJob(j: any) {
		this.selectedJob.set(j);
		this.showJobModal.set(true);
	}

	closeJob() {
		this.showJobModal.set(false);
	}

	openNews(n: any) {
		this.selectedNews.set(n);
		this.showNewsModal.set(true);
	}

	closeNews() {
		this.showNewsModal.set(false);
	}

	openContact(data: any) {
		this.showJobModal.set(false);
		this.selectedContact.set(data);
		this.showContactModal.set(true);
	}

	closeContact() {
		this.showContactModal.set(false);
		this.userName.set('');
	}

	sendMessage() {
		const payload = { from: this.userName(), mail: this.userMail(), text: this.userMessage() };
		console.log('UPLINK_SUCCESS:', payload);

		this.showContactModal.set(false);
		this.showSuccessToast.set(true);

		setTimeout(() => this.showSuccessToast.set(false), 3000);
	}
}