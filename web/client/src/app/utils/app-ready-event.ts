// Import the core angular services.
import { DOCUMENT } from '@angular/platform-browser';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';

// https://www.bennadel.com/blog/3151-revisited-creating-an-event-driven-pre-bootstrap-loading-screen-in-angular-2-0-0.htm?&utm_campaign=NG-Newsletter&utm_medium=email&utm_source=NG-Newsletter_167
@Injectable()
export class AppReadyEvent {

    private doc: Document;
    private isAppReady: boolean;

    // I initialize the service.
    // --
    // NOTE: When I first tried to approach this problem, I was going to try and use the
    // core Renderer service; however, it appears that the Renderer cannot be injected
    // into a service object (throws error: No provider for Renderer!). As such, I am
    // treating THIS class as the implementation of the DOM abstraction (so to speak),
    // which can be overridden on a per-environment basis.
    constructor( @Inject(DOCUMENT) doc: any) {
        this.doc = doc;
        this.isAppReady = false;
    }

    // I trigger the "appready" event.
    // --
    // NOTE: In this particular implementation of this service on this PLATFORM, this
    // simply triggers the event on the DOM (Document Object Model); however, one could
    // easily imagine this event being triggered on an Observable or some other type of
    // message transport that makes more sense for a different platform. Nothing about
    // the DOM-interaction leaks outside of this service.
    public trigger(): void {
        // If the app-ready event has already been triggered, just ignore any subsequent
        // calls to trigger it again.
        if (this.isAppReady) {
            return;
        }

        let bubbles = true;
        let cancelable = false;

        this.doc.dispatchEvent(this.createEvent('appready', bubbles, cancelable));
        this.isAppReady = true;
    }


    // I create and return a custom event with the given configuration.
    private createEvent(
        eventType: string,
        bubbles: boolean,
        cancelable: boolean
    ): Event {
        let customEvent: any
        // IE (shakes fist) uses some other kind of event initialization. As such,
        // we'll default to trying the "normal" event generation and then fallback to
        // using the IE version.
        try {
            customEvent = new CustomEvent(
                eventType,
                {
                    bubbles: bubbles,
                    cancelable: cancelable
                }
            );

        } catch (error) {
            customEvent = this.doc.createEvent('CustomEvent');
            customEvent.initCustomEvent(eventType, bubbles, cancelable);
        }

        return (customEvent);
    }
}
