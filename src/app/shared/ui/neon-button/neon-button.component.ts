import { Component, input } from '@angular/core';

@Component({
  selector: 'app-neon-button',
  standalone: true,
  imports: [],
  templateUrl: './neon-button.component.html',
  styleUrl: './neon-button.component.scss'
})
export class NeonButtonComponent {
  /** The visual style of the button */
  variant = input<'primary' | 'ghost' | 'danger'>('primary');
  
  /** Controls the interactive state of the button */
  disabled = input(false);
}
