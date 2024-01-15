import { PopupOverlay } from '../../../../enums/PopupOverlay';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { usePopupCull } from '../../../../hooks/usePopupCull';
import { setCurrentOverlay } from '../../../../store/page';
import { ScrollableOverlay } from '../../../shared/ScrollOverlay/ScrollableOverlay';
import '../ManifestoPopup/ManifestoPopup.scss';

export function TermsPopup() {
    const [needRender, isActive] = usePopupCull(PopupOverlay.Terms);
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
                    <h1 className="title">TERMS OF SERVICE</h1>
                    <p>
                        These Terms of Service («Terms») apply to users of the Website («Users») located at
                        neura.adanede.com («Website»). The Website, smart contracts, services and tools located on the
                        Website («Services») are managed by the owner of the Website
                    </p>
                    <p>
                        «You» and «Your» in these Terms means you as a User. If you are using the Service on behalf of a
                        legal entity or individual entrepreneur, you warrant that you are a legal representative with
                        all necessary powers, and you, on behalf of the company or individual entrepreneur, agree to
                        these Terms in full.
                    </p>
                    <p>
                        The Website hosts a collection of NFTs (digital works of art) running on the Ethereum
                        blockchain.
                        Users are solely responsible for the security of their private Ethereum wallets, including Users
                        are solely responsible for managing their wallets, as well as verifying any transactions and
                        smart contracts entered into on the Website. The Website is only an aggregator through which
                        users can exchange NFTs, the Company does not bear any responsibility for transactions, smart
                        contracts carried out by Users using the Site
                    </p>
                    <p>
                        These Terms contain important information about the basic rights and obligations of Users.
                        Please
                        read these Terms carefully before using the Website. We warn you that by starting to use the
                        Website you agree to these Terms, accepting them in full. If you do not agree to the Terms or do
                        not understand them, please stop using the Website.
                    </p>
                    <p>
                        These Terms may be amended and supplemented at any time at our discretion. In this case, changes
                        and additions come into force from the moment they are published on the Website, and you are
                        responsible for timely familiarization with the new version of the Terms.
                    </p>
                    <h2 className="title-small">OWNERSHIP</h2>
                    <ul>
                        <li>
                            After making an NFT purchase, you become the owner of the NFT and, accordingly, the owner of
                            the digital work of art. The transfer of ownership of NFTs is entirely done through a smart
                            contract and the Ethereum network, we cannot influence the ownership of any NFT in any way.
                        </li>
                        <li>
                            Personal Use. If you comply with the Terms in good faith, the company grants you a
                            royalty-free license to use the NFT purchased by you directly for the following purposes:
                            <ul>
                                <li>
                                    For your personal non-commercial use;
                                </li>
                                <li>
                                    For listing on the marketplace, cryptographically verifies each NFT owner&apos;s
                                    rights to display art to ensure that only the actual owner can display the art;
                                </li>
                            </ul>
                        </li>
                        <li>
                            Commercial use. If you comply with the Terms in good faith, the company grants you a free
                            license to use the NFT you have purchased for commercial purposes. Including for the use,
                            copying and demonstration of purchased NFT, for example, (but not limited to) demonstration
                            of copies of the NFT image on things and objects for sale. nothing in this section will be
                            considered limiting you in:
                            <ul>
                                <li>
                                    owning or managing a marketplace that permits the use and sale of NFT in general,
                                    provided that the marketplace cryptographically verifies the rights of each NFT
                                    owner to display works of art for their NFT to ensure that only the actual owner can
                                    display art;
                                </li>
                                <li>
                                    ownership or management of a third-party website or application that authorizes the
                                    inclusion, involvement or participation of the NFT as a whole, provided that the
                                    third-party website or application cryptographically verifies the rights of each NFT
                                    owner to display Art for their NFT to ensure that only the actual owner can display
                                    Art, and provided that that the Artwork will no longer be visible once the owner of
                                    the Purchased NFT leaves the Website;
                                </li>
                                <li> receiving income from any of the above.</li>
                            </ul>
                        </li>
                    </ul>
                    <h2 className="title-small">YOUR USER ACCOUNT AND ACCOUNT SECURITY</h2>
                    <ul>
                        <li>
                            You need to register an account to access our Services. Registration on our Website means
                            connecting to Services through your MetaMask digital wallet or using WalletConnect protocol.
                            Linking a Digital Wallet to the Services is necessary in order to be able to buy, store and
                            make transactions using the Services, as well as to connect your NFT to the Services. When
                            making a purchase, there are Ethereum network fees that are set and calculated by the
                            Ethereum network itself at the time of purchase. The assets stored in your Digital Wallet
                            are owned and controlled exclusively by you. Digital wallets are not affiliated with us, are
                            not supported by us, are not controlled by us and are not affiliated with us. We may not be
                            able to help you recover the assets stored in your Digital Wallet because they are not under
                            your control. We do not bear any responsibility to you in connection with your use of a
                            digital wallet and do not make any representations or guarantees regarding how the Services
                            will work with any particular digital wallet. The secret keys, credentials, passwords,
                            initial phrases or secret recovery phrases necessary to decrypt or gain access to the
                            digital wallet are stored exclusively by you, not by us. If you decide to transfer goods
                            from one digital wallet to another, such transfers will take place on a public blockchain,
                            and we do not accept any responsibility for any such transfer, including any loss, data
                            corruption or other negative consequences that may arise for your Offers, digital wallets or
                            other assets when attempting to transfer assets between digital wallets. We reserve the
                            right, with or without prior notice, at our sole and complete discretion, to terminate,
                            modify or restrict the operation of any Digital Wallet with the Services. You represent and
                            warrant that you are the rightful owner of any Digital Wallet and that you use this Digital
                            Wallet in accordance with the terms and conditions of the respective digital wallet
                            provider. If you have any problems with your digital wallet, contact your digital wallet
                            service provider.
                        </li>
                        <li>
                            {' '}
                            You declare that only you have access to the account you have registered. You guarantee
                            that you will not grant access to your account to third parties without our prior written
                            consent.
                        </li>
                        <li>
                            You are solely responsible for the security of your account, including you independently
                            control the security of your password. In no case are we responsible for cases of
                            unauthorized access or use of your account. You undertake to independently monitor
                            unauthorized or suspicious activities in your account, and if they are detected, immediately
                            notify us.
                        </li>
                    </ul>
                    <h2 className="title-small">SUSPENSION OF ACCOUNT</h2>
                    <p>
                        a. We reserve the right to suspend or block your access to your account/or our Website at any
                        time if we decide that:
                        <ul>
                            <li>
                                Your account is used for illegal purposes, including, but not limited to, use for money
                                laundering, use for fraudulent activities;
                            </li>
                            <li>You have provided false information or data;</li>
                            <li>You have made any transactions in violation of the Terms or the law.</li>
                        </ul>
                    </p>
                    <h2 className="title-small">PROHIBITED CONDUCT AND CONTENT</h2>
                    <ul>
                        <li>
                            You guarantee that you will not violate applicable laws, contracts or the rights of third
                            parties (including intellectual property). In addition, you guarantee that you will not:
                            <ul>
                                <li>use or attempt to use another user&apos;s account;</li>
                                <li>impersonate another user;</li>
                                <li>
                                    copy, reproduce, distribute, publicly perform or publicly display all or parts of
                                    our Services, except as expressly permitted by us or our licensors;
                                </li>
                                <li>
                                    modify our Services in any way, delete any of our notices or signs confirming our
                                    ownership of certain intellectual property objects, otherwise create any derivative
                                    works based on our Services or Website;
                                </li>
                                <li>
                                    use our Website and the services provided for other purposes and in any way that may
                                    interfere with, disrupt, negatively affect or prevent other users from fully using
                                    our Services or that may damage, disable, overload or impair the functioning of our
                                    Services in any way;
                                </li>
                                <li>
                                    recreate any aspect of our Services or do anything that can detect the source code
                                    or circumvent measures used to prevent or restrict access to any part of our
                                    Services;
                                </li>
                                <li>
                                    attempt to circumvent any content filtering methods that we use, or attempt to
                                    access any feature or area of our Services that you are not allowed to access;
                                </li>
                                <li>
                                    use any data mining, robots or similar data collection or extraction methods
                                    designed to collect or extract data from our Services;
                                </li>
                                <li>
                                    recreate and use any websites or applications designed to interact with our
                                    Services;
                                </li>
                                <li>
                                    use our Services for any illegal or unauthorized purposes, or participate in,
                                    encourage or promote any activity that violates the law and these Terms.
                                </li>

                            </ul>
                        </li>
                    </ul>
                    <p>
                        b. This section applies at Our discretion. The non-application of this section in some cases
                        does
                        not mean our waiver of the right to apply it in other cases. The terms of this section do not
                        mean that our Website will not contain any content prohibited by the terms of this section.
                    </p>

                    <h2 className="title-small">TRADEMARKS</h2>
                    <ul>
                        <li>
                            The results of intellectual activity (including, but not limited to: databases, text
                            materials, articles, patent decisions, commercial designations, trademarks, other materials)
                            posted on the Site, together and separately constitute the content of the Site
                        </li>
                        <li>
                            We are the copyright holder of the Site content (except in cases when the corresponding page
                            with the content indicates otherwise or the copyright holder of any content posted on the
                            Site is another person or persons).
                        </li>
                        <li>
                            We own the intellectual rights to the logo and the name of the Site, as well as elements of
                            the design and stylistic design of the Site.
                        </li>
                        <li>
                            {' '}
                            In case of any use (full and partial) of the text materials of the Site on other sites on
                            the Internet or other forms of use in electronic form, it is mandatory to indicate in the
                            material to the Site in the form of an active hyperlink indexed by search engines to the
                            corresponding page of the placement of text material on the Site. The font size of the
                            source link should not be less than the font size of the text in which the text materials
                            are used. At the same time, any reference to the Services does not mean a recommendation or
                            sponsorship on our part.
                        </li>
                        <li>
                            When using the text materials of the Site, the processing of their original text is not
                            allowed. The modification of the material is possible only if it does not lead to a
                            distortion of its meaning.
                        </li>
                    </ul>
                    <h2 className="title-small">INDEMNIFICATION</h2>
                    <ul>
                        <li>
                            You guarantee that, to the maximum extent possible provided for by applicable law, you will
                            protect Us, any of Our representatives, our branches and subsidiaries, our partners and
                            employees from making any claims, claims arising from:
                            <ul>
                                <li>Your use of the services of our Website;</li>
                                <li>Leaving your reviews;</li>
                                <li>Your use of NFT</li>
                            </ul>
                        </li>
                        <li>
                            You undertake to cooperate with us if it is necessary to protect our interests, and you also
                            undertake to pay all costs and expenses associated with the implementation of such
                            protection.
                        </li>
                    </ul>
                    <h2 className="title-small">DISCLAIMERS</h2>
                    <ul>
                        <li>
                            YOU USE THE WEBSITE INDEPENDENTLY AND AT YOUR OWN RISK, THIS MEANS THAT ANY CONTENT POSTED
                            ON THE WEBSITE (INCLUDING, BUT NOT LIMITED TO DATABASES, TEXT MATERIALS, ARTICLES, PATENT
                            DECISIONS, COMMERCIAL DESIGNATIONS, TRADEMARKS, OTHER MATERIALS) OWNED BY THE COMPANY OR
                            OTHER THIRD PARTIES, ANY RELATED WITH THIS CONTENT, THE MATERIALS AS WELL AS NFT ARE
                            PROVIDED &quot;AS IS&quot; WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                            LIMITED TO WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT OF PROPRIETARY RIGHTS OR OTHER
                            RIGHTS. REGARDLESS OF THE FACT THAT THE COMPANY TRIES TO ENSURE MAXIMUM SECURITY WHEN USING
                            THE WEBSITE AND OUR SERVICES, WE CANNOT DECLARE AND GUARANTEE THAT OUR SERVICES DO NOT
                            CONTAIN VIRUSES OR OTHER MALICIOUS COMPONENTS. YOU ARE AWARE OF AND ACCEPT ALL RISKS
                            ASSOCIATED WITH THE USE OF THE SITE AND THE USE OF THE SERVICES AND OUR SERVICES, INCLUDING
                            RIKS, RELATED TO THE QUALITY AND PERFORMANCE OF OUR SERVICES.
                        </li>
                        <li>
                            WE ARE NOT LIABLE TO YOU FOR ANY DAMAGES INCURRED BY YOU IN CONNECTION WITH THE USE OF OUR
                            WEBSITE, ARE NOT RESPONSIBLE AND WILL NOT BE LIABLE TO YOU FOR ANY ACCESS TO OR USE OF ANY
                            RELATED CONTENT, THIRD PARTY CONTENT, MANUALS OR DIGITAL COLLECTIBLES, INCLUDING, BUT NOT
                            LIMITED TO, ANY LOSS, DAMAGE OR CLAIMS ARISING AS A RESULT OF: (A) USER ERROR, SUCH AS
                            FORGOTTEN PASSWORDS, INCORRECTLY CONSTRUCTED TRANSACTIONS OR INCORRECTLY ENTERED ADDRESSES;
                            (B) SERVER FAILURE OR DATA LOSS; (C) CORRUPTED WALLET FILES; (D) UNAUTHORIZED ACCESS TO
                            APPLICATIONS; OR (E) ANY UNAUTHORIZED ACTIONS OF THIRD PARTIES, INCLUDING, BUT NOT LIMITED
                            TO, THE USE OF VIRUSES, PHISHING, BRUTEFORCE OR OTHER MEANS OF ATTACKING THE SITE OR THE
                            CORRESPONDING BLOCKCHAIN.
                        </li>
                    </ul>
                    <h2 className="title-small">DISCLAIMER OF DAMAGES</h2>
                    <p>
                        UNDER ANY CIRCUMSTANCES, WE WILL NOT BE LIABLE TO YOU UNDER ANY THEORY OF LIABILITY — WHETHER
                        BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, WARRANTY OR OTHERWISE — FOR ANY INDIRECT,
                        EXEMPLARY, INCIDENTAL, PUNITIVE OR SPECIAL DAMAGES, OR LOST PROFITS, EVEN IF WE HAVE BEEN WARNED
                        ABOUT THE POSSIBILITY OF SUCH DAMAGE.
                    </p>
                    <h2 className="title-small">DISPUTE RESOLUTION. GOVERNING LAW</h2>
                    <ul>
                        <li>
                            These conditions are governed by the law of the place where Company is registered.
                        </li>
                        <li>
                            You agree that in the event of any dispute between you and the Company Entities, you will
                            first contact the Company and make a good faith sustained effort to resolve the dispute
                            before resorting to more formal means of resolution, including without limitation, any court
                            action or arbitration.
                        </li>
                        <li>
                            After the informal dispute resolution process, any remaining dispute, controversy, or claim
                            (collectively, “Claim”), whether based in contract, tort, statute, fraud, or any other legal
                            theory, relating in any way to your use of the Company’s services and/or products, including
                            the Services, will be resolved by a court at the Сompany’s location or arbitration at the
                            Сompany&apos;s choice
                        </li>
                        <li>No class or representative action or arbitration is permitted under this section.</li>
                    </ul>
                    <h2 className="title-small">TERMINATION</h2>
                    <ul>
                        <li>
                            You acknowledge and agree that the Company, in its sole and absolute discretion, may (i)
                            stop providing support for or access to the Services at any time, for any reason or no
                            reason, and (ii) terminate your right to use the Services and terminate these Terms
                            immediately at any time without notice or liability to you.
                        </li>
                        <li>
                            In the event of termination of these Terms or your rights or license granted hereunder, you
                            must (i) cease to use the Services; (ii) immediately and permanently remove from all of your
                            devices all aspects of the Services in your possession and control. Upon termination of
                            these Terms for any reason, all licenses granted herein immediately shall term.
                        </li>
                    </ul>
                    <h2 className="title-small"> LOCATION OF OUR PRIVACY POLICY</h2>
                    <p>
                        Our privacy policy, which contains information about how we process the information we receive
                        from you, is located on the Website at neura.adanede.com. Please read this Privacy Policy before
                        using the Website.
                    </p>
                </div>
            </div>
        </ScrollableOverlay>
    ) : null;
}
