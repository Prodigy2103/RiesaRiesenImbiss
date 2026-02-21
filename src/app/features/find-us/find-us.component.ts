import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NeonButtonComponent } from "../../shared/ui/neon-button/neon-button.component";

interface Comment {
  id: string;
  author: string;
  text: string;
  rating: number;
}

@Component({
  selector: 'feature-find-us',
  standalone: true,
  imports: [CommonModule, FormsModule, NeonButtonComponent],
  templateUrl: './find-us.component.html',
  styleUrl: './find-us.component.scss'
})
export class FindUsComponent {
  currentRating: number = 0;
  userComment: string = '';
  userName: string = '';

  mockComments: Comment[] = [
    { id: '842', author: 'CyberSam', text: 'Bester Döner in Riesa!', rating: 5 },
    { id: '109', author: 'NeonRider', text: 'Die scharfe Sauce ist legendär.', rating: 3.5 },
    { id: '221', author: 'Techie99', text: 'Portionen sind riesig, Name ist Programm.', rating: 4.5 }
  ];

  /**
   * Calculates a star rating based on the click position within a star element.
   * Allows users to select half-star increments for more precise feedback.
   * @param event The mouse click event.
   * @param index The zero-based index of the star clicked.
   */
  setRating(event: MouseEvent, index: number): void {
    const starWidth = (event.target as HTMLElement).offsetWidth;
    const clickX = event.offsetX;
    const value = clickX < starWidth / 2 ? 0.5 : 1;
    this.currentRating = index + value;
  }

  /**
   * Determines the fill percentage of a star icon for visual representation.
   * Helps users see the exact rating (full, half, or empty) at a glance.
   * @param index The star index being rendered.
   * @param rating The total rating value to compare against.
   */
  getStarFill(index: number, rating: number): string {
    const diff = rating - index;
    if (diff >= 1) return '100%';
    if (diff === 0.5) return '50%';
    return '0%';
  }

  /**
   * Validates and adds a new feedback entry to the list.
   * Ensures all required fields are filled and resets the form after submission.
   */
  submitFeedback(): void {
    if (this.currentRating === 0 || !this.userComment.trim() || !this.userName.trim()) {
      alert("Bitte gib einen Namen, ein Rating und einen Kommentar ein.");
      return;
    }
    this.addComment();
    this.resetForm();
  }

  /**
   * Helper to push the new comment into the list with a random ID.
   * Keeps the main submission logic clean and easy to follow.
   */
  private addComment(): void {
    this.mockComments.unshift({
      id: Math.floor(Math.random() * 900 + 100).toString(),
      author: this.userName,
      text: this.userComment,
      rating: this.currentRating
    });
  }

  /**
   * Clears all input fields and resets the rating selector.
   * Prepares the UI for the next user interaction.
   */
  private resetForm(): void {
    this.userComment = '';
    this.userName = '';
    this.currentRating = 0;
  }
}