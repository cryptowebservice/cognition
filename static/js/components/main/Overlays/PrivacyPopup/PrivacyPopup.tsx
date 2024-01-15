import { PopupOverlay } from '../../../../enums/PopupOverlay';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { usePopupCull } from '../../../../hooks/usePopupCull';
import { setCurrentOverlay } from '../../../../store/page';
import { ScrollableOverlay } from '../../../shared/ScrollOverlay/ScrollableOverlay';
import '../ManifestoPopup/ManifestoPopup.scss';

export function PrivacyPopup() {
    const [needRender, isActive] = usePopupCull(PopupOverlay.Privacy);
    const mobile = useIsMobile();

    // Закрытие
    const handleClose = () => {
        if (!mobile) {
            setCurrentOverlay(PopupOverlay.None);
        }
    };

    return needRender ? (
        <ScrollableOverlay active={isActive}>
            <div id="manifesto-popup" onClick={handleClose}>
                <div className="content">
                    <h1 className="title">PRIVACY POLICY</h1>
                    <p>
                        This Privacy Policy explains how your personal information is collected, used and shared when using the services of the Website located at: neura.adanede.com. &quot;You&quot; and &quot;Your&quot; in this Policy means you as a User as construed in our Terms of Service.
                    </p>
                    <h2 className="title-small">INFORMATION WE COLLECT</h2>
                    <p>
                        When you use the Website, we collect some information. The information we collect falls into one of two categories: &quot;automatically collected&quot; information and &quot;voluntarily provided&quot; information.
                    </p>
                    <p>
                        &quot;Automatically collected&quot; information refers to any information automatically sent by your devices when you access our Services.
                    </p>
                    <p>
                        &quot;Voluntarily provided&quot; information refers to any information that you knowingly and actively provide to us when using or participating in any of our Services.
                    </p>

                    <h2 className="title-small">VOLUNTARY PROVIDED INFORMATION</h2>

                    <p>We may ask you for personal information - for example, when you register an account, make a purchase, request support for our services, or when you otherwise contact us - which may include one or more of the following:</p>
                    <ul>
                        <li>
                            Name
                        </li>
                        <li>
                            Email address
                        </li>
                        <li>
                            Digital asset wallet address
                        </li>
                        <li>
                            Any other information you choose to provide.
                        </li>
                    </ul>
                    <p>
                        Providing you with the specified information means providing us with full and unconditional consent to the processing of the reported personal data, including actions for the collection, technical processing, systematization, accumulation, transfer (distribution, provision, access), clarification, copying, use, storage, depersonalization, blocking, destruction.
                    </p>
                    <p>
                        Personal data is processed for the following purposes:
                    </p>
                    <ul>
                        <li>
                            Providing you with the services of the Website;
                        </li>
                        <li>
                            Providing you with access to personalized resources of the Website; Establishing feedback with you, including sending notifications, requests regarding the use of the Website, the provision of services
                        </li>
                        <li>
                            To provide you with effective customer and technical support in the event of problems related to the use of the Website;
                        </li>
                        <li>
                            Providing you with special offers, newsletters and other information.
                        </li>
                    </ul>
                    <p>
                        The completeness and relevance of the personal data provided by you lies in your area of responsibility along with your right to edit (update, supplement) the previously provided personal data at any time.
                    </p>
                    <p>
                        The validity of your consent to the processing of personal data shall be terminated no earlier than after 15 (Fifteen) days from the date of receipt of the relevant written withdrawal by the subject of personal data of the relevant consent.
                    </p>

                    <h2 className="title-small">AUTOMATICALLY COLLECTED INFORMATION</h2>
                    <p>
                        When you visit our Website, our servers may automatically log standard data provided by your web browser. This may include your device&apos;s Internet Protocol (IP) address, geolocation data, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, the site that is linked to, elements of the web the site that is clicked on and other information about your visit.
                    </p>
                    <p>
                        In addition, if you encounter certain errors while using the site, we may automatically collect information about the error and the circumstances surrounding it. This data may include technical details about your device, what you were trying to do when the error occurred, and other technical information related to the problem. You may or may not be notified of such errors even at the time they occur, that they have occurred, or what the nature of the error is.
                    </p>
                    <p>
                        Please be aware that while this information may not be personally identifiable on its own, it can be combined with other data to identify individuals.
                    </p>
                    <p>We may collect User Device Information in the following ways:</p>
                    <ul>
                        <li>Use of data files &quot; Cookies &quot; that contain an anonymous unique identifier;</li>
                        <li>The use of &quot;Log files&quot; that allow you to track actions performed on the Site, collect data about the User&apos;s IP address, data about the User&apos;s browser type, transition/exit page and date/time stamps;</li>
                        <li>The use of &quot;web beacons&quot;, &quot;tags&quot; and &quot;pixels&quot; to record information about how you browse the Website.</li>
                    </ul>

                    <h2 className="title-small">AUTOMATICALLY COLLECTED INFORMATION</h2>
                    <p>
                        Our website, like most websites, uses cookies to collect information about you and your activity on our site.
                    </p>
                    <p>
                        By using the services of the Website, you give full and unconditional consent to the use of cookies.
                    </p>
                    <p>
                        A cookie is a small piece of data that our website stores on your computer and that you access every time you visit, so that we can understand how you use our website.
                    </p>
                    <p>
                        Cookies help us improve our Services, including by performing statistical analysis, evaluating audience size and usage patterns, and identifying a user&apos;s digital asset wallet address and wallet provider.
                    </p>
                    <p>
                        We use cookies from providers such as Hotjar, Microsoft Clarity, Google Analytics.
                    </p>
                    <p>
                        You can control how your devices allow cookies. If you wish, you can block or delete our cookies from your browser; however, blocking or deleting cookies may result in some of our services not working properly or inability to access certain parts of our website.
                    </p>

                    <h2 className="title-small">DATA STORAGE</h2>
                    <p>
                        When you make a transaction through the Website, we retain information about the order you have made until you ask us to delete this information.
                    </p>

                    <h2 className="title-small">MINORS</h2>
                    <p>Our Website is not intended for persons under the age of 18.</p>
                    <h2 className="title-small">CHILDREN&apos;S PRIVACY</h2>
                    <p>
                        In addition, please note that our Services are not intended for children under the age of 13, and we do not collect any personal information from children under the age of 13. In the event that we become aware that we have inadvertently collected information from a child under the age of 13, we will use reasonable efforts to remove such information from our records.
                    </p>
                    <p>
                        In the event that you are the parent or guardian of a child under the age of 13 who has provided us with personal information in any way, please contact us with a request to delete such information.

                    </p>
                    <h2 className="title-small">CHANGES</h2>
                    <p>
                        This Privacy Policy may be changed by us at any time. Changes and additions come into force from the moment of their publication, and you undertake to familiarize yourself with the current versions of this Policy.
                    </p>

                </div>
            </div>
        </ScrollableOverlay>
    ) : null;
}
