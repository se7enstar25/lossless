import React, { Fragment, memo } from 'react';
import { Button, Table, SegmentedControl, Checkbox, Select } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';


const Settings = memo(({
  changeOutDir, customOutDir, autoMerge, setAutoMerge, keyframeCut, setKeyframeCut, invertCutSegments, setInvertCutSegments,
  autoSaveProjectFile, setAutoSaveProjectFile, timecodeShowFrames, setTimecodeShowFrames, askBeforeClose, setAskBeforeClose,
  renderOutFmt, AutoExportToggler, renderCaptureFormatButton, onWheelTunerRequested, language, setLanguage,
  invertTimelineScroll, setInvertTimelineScroll,
}) => {
  const { t } = useTranslation();

  // eslint-disable-next-line react/jsx-props-no-spreading
  const Row = (props) => <Table.Row height="auto" paddingY={12} {...props} />;
  // eslint-disable-next-line react/jsx-props-no-spreading
  const KeyCell = (props) => <Table.TextCell textProps={{ whiteSpace: 'auto' }} {...props} />;

  function onLangChange(e) {
    const { value } = e.target;
    const l = value !== '' ? value : undefined;
    setLanguage(l);
  }

  // https://www.electronjs.org/docs/api/locales
  // See i18n.js
  const langNames = {
    en: 'English',
    nb: 'Norsk',
    zh: '中文',
    it: 'Italiano',
  };

  return (
    <Fragment>
      <Row>
        <KeyCell>{t('App language')}</KeyCell>
        <Table.TextCell>
          <Select value={language || ''} onChange={onLangChange}>
            <option key="" value="">{t('System language')}</option>
            {Object.keys(langNames).map((lang) => <option key={lang} value={lang}>{langNames[lang]}</option>)}
          </Select>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Output format (default autodetected)')}</KeyCell>
        <Table.TextCell>{renderOutFmt({ width: '100%' })}</Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Working directory')}<br />
          {t('This is where working files, exported files, project files (CSV) are stored.')}
        </KeyCell>
        <Table.TextCell>
          <Button onClick={changeOutDir}>
            {customOutDir ? t('Custom working directory') : t('Same directory as input file')}
          </Button>
          <div>{customOutDir}</div>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Auto merge segments to one file during export or export to separate files?')}</KeyCell>
        <Table.TextCell>
          <SegmentedControl
            options={[{ label: t('Auto merge'), value: 'automerge' }, { label: t('Separate'), value: 'separate' }]}
            value={autoMerge ? 'automerge' : 'separate'}
            onChange={value => setAutoMerge(value === 'automerge')}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Keyframe cut mode')}<br />
          <b>{t('Keyframe cut')}</b>: Cut at the nearest keyframe (not accurate time.) Equiv to <i>ffmpeg -ss -i ...</i><br />
          <b>{t('Normal cut')}</b>: Accurate time but could leave an empty portion at the beginning of the video. Equiv to <i>ffmpeg -i -ss ...</i><br />
        </KeyCell>
        <Table.TextCell>
          <SegmentedControl
            options={[{ label: t('Keyframe cut'), value: 'keyframe' }, { label: t('Normal cut'), value: 'normal' }]}
            value={keyframeCut ? 'keyframe' : 'normal'}
            onChange={value => setKeyframeCut(value === 'keyframe')}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          <span role="img" aria-label="Yin Yang">☯️</span> {t('Choose cutting mode: Remove or keep selected segments from video when exporting?')}<br />
          <b>{t('Keep')}</b>: {t('The video inside segments will be kept, while the video outside will be discarded.')}<br />
          <b>{t('Remove')}</b>: {t('The video inside segments will be discarded, while the video surrounding them will be kept.')}
        </KeyCell>
        <Table.TextCell>
          <SegmentedControl
            options={[{ label: t('Remove'), value: 'discard' }, { label: t('Keep'), value: 'keep' }]}
            value={invertCutSegments ? 'discard' : 'keep'}
            onChange={value => setInvertCutSegments(value === 'discard')}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Extract unprocessable tracks to separate files or discard them?')}<br />
          {t('(data tracks such as GoPro GPS, telemetry etc. are not copied over by default because ffmpeg cannot cut them, thus they will cause the media duration to stay the same after cutting video/audio)')}
        </KeyCell>
        <Table.TextCell>
          <AutoExportToggler />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Auto save project file?')}<br />
          {t('The project will be stored along with the output files as a CSV file')}
        </KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Auto save project')}
            checked={autoSaveProjectFile}
            onChange={e => setAutoSaveProjectFile(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Snapshot capture format')}
        </KeyCell>
        <Table.TextCell>
          {renderCaptureFormatButton()}
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('In timecode show')}</KeyCell>
        <Table.TextCell>
          <SegmentedControl
            options={[{ label: t('Frame numbers'), value: 'frames' }, { label: t('Millisecond fractions'), value: 'ms' }]}
            value={timecodeShowFrames ? 'frames' : 'ms'}
            onChange={value => setTimecodeShowFrames(value === 'frames')}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Timeline trackpad/wheel sensitivity')}</KeyCell>
        <Table.TextCell>
          <Button onClick={onWheelTunerRequested}>{t('Change sensitivity')}</Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Invert timeline trackpad/wheel direction?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Invert direction')}
            checked={invertTimelineScroll}
            onChange={e => setInvertTimelineScroll(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Ask for confirmation when closing app or file?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Ask before closing')}
            checked={askBeforeClose}
            onChange={e => setAskBeforeClose(e.target.checked)}
          />
        </Table.TextCell>
      </Row>
    </Fragment>
  );
});

export default Settings;
