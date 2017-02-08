import { inject, TestBed } from '@angular/core/testing';

import { BaseMapper, MappingObject } from './base.mapper';

describe('BaseMapper', () => {

    beforeEach(() => TestBed.configureTestingModule({
        providers: [BaseMapper]
    }));

    let baseMapper;
    beforeEach(inject([BaseMapper], (_baseMapper) => {
        baseMapper = _baseMapper;
    }));

    it('Should initialize correctly', () => {
        expect(baseMapper).toBeDefined();
    });

    it('Should not map non objects', () => {
        expect(() => {
            baseMapper.map('test1', {});
        }).toThrowError('Cannot map non object');
    });

    it('Should throw error on no MappingData present', () => {
        expect(() => {
            baseMapper.map({}, undefined);
        }).toThrowError('No mapping information present');
    });

    it('Should do simple mapping', () => {
        expect(baseMapper.map({
            'simple-prop-with-lines': 'a value',
            'otherProp': 'another value',
            'last-prop': true
        }, {
            'simple-prop-with-lines': 'simplePropWithoutLines',
            'last-prop': 'lastProp'
        })).toEqual({
            'simplePropWithoutLines': 'a value',
            'otherProp': 'another value',
            'lastProp': true
        });
    });

    it('Should not crash on unavailable properties', () => {
        expect(baseMapper.map({
            'test1': 'value',
            'test123': 'value2'
        }, {
            'test1': 'test',
            'test456': 'test789',
            'test654': {
                $replace: 'test987',
                $mapping: {
                    't123': 'd123'
                }
            }
        })).toEqual({
            'test': 'value',
            'test123': 'value2'
        });
    });

    it('Should do array mapping', () => {
        expect(baseMapper.map([
            {
                'test1': 'value',
                'test123': 'value2'
            }
        ], {
            'test1': 'new'
        })).toEqual([
            {
                'new': 'value',
                'test123': 'value2'
            }
        ]);
    });

    it('Should do advanced mapping', () => {
        expect(baseMapper.map({
            'companyDataCollection': [
                {'siC_code': 123, 'true': false},
                {'siC_code': 456}
            ],
            'testprop': 1,
            'identificationData': {
                'entry_date': '12-03-2016',
                'iD_Number': 12345,
                'name': 'test'
            },
            'organization': {
                'legal_Form': '06',
                'name1': 'test',
                'first_Commercial_name': 'compname',
                'extra_mapping': {
                    'extra_mapping_value': 'value',
                    'val': 1
                }
            }
        }, {
            'companyDataCollection': <MappingObject>{
                $mapping: {
                    'siC_code': 'SICCode'
                }
            },
            'identificationData': <MappingObject>{
                $replace: 'identification',
                $mapping: {
                    'entry_date': 'entryDate',
                    'iD_Number': 'idNumber'
                }
            },
            'organization': <MappingObject>{
                $mapping: {
                    'legal_Form': 'legalForm',
                    'name1': 'companyName',
                    'first_Commercial_name': <MappingObject> {
                        $replace: 'commercialName',
                        $process: (val) => { return val.toUpperCase(); }
                    },
                    'extra_mapping': <MappingObject> {
                        $replace: 'extraMapping',
                        $mapping: {
                            'extra_mapping_value': 'extraMappingVal'
                        }
                    }
                }
            }
        })).toEqual({
            'companyDataCollection': [
                {'SICCode': 123, 'true': false},
                {'SICCode': 456}
            ],
            'testprop': 1,
            'identification': {
                'entryDate': '12-03-2016',
                'idNumber': 12345,
                'name': 'test'
            },
            'organization': {
                'legalForm': '06',
                'companyName': 'test',
                'commercialName': 'COMPNAME',
                'extraMapping': {
                    'extraMappingVal': 'value',
                    'val': 1
                }
            }
        });
    });

});
